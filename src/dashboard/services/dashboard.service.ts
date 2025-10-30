import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { TransactionEntity } from '@/transactions/entities/transaction.entity';
import { EnvelopeEnity } from '@/envelopes/entities/envelope.entity';
import { DashboardFiltersDto } from '../dto/dashboard-filters.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionsRepository: Repository<TransactionEntity>,

    @InjectRepository(EnvelopeEnity)
    private readonly envelopesRepository: Repository<EnvelopeEnity>,
  ) {}

  /**
   * Obtiene todos los datos del dashboard del usuario
   */
  async getDashboardData(userId: string, filters?: DashboardFiltersDto) {
    const [
      envelopesSummary,
      envelopesDetail,
      transfersSummary,
      recentTransfers,
      totalsByType,
      recentTransactions,
    ] = await Promise.all([
      this.getEnvelopesSummary(userId),
      this.getEnvelopesDetail(userId, filters),
      this.getTransfersSummary(userId, filters),
      this.getRecentTransfers(userId, 10),
      this.getTotalsByType(userId, filters),
      this.getRecentTransactions(userId, 10),
    ]);

    return {
      envelopesSummary,
      envelopesDetail,
      transfersSummary,
      recentTransfers,
      totalsByType,
      recentTransactions,
      filters: filters || null,
    };
  }

  /**
   * Resumen general de todos los sobres
   */
  async getEnvelopesSummary(userId: string) {
    const envelopes = await this.envelopesRepository
      .createQueryBuilder('envelope')
      .where('envelope.user_id = :userId', { userId })
      .andWhere('envelope.is_active = :isActive', { isActive: true })
      .select([
        'COUNT(envelope.id) as totalEnvelopes',
        'SUM(envelope.envelope_amount) as totalAmount',
        'AVG(envelope.envelope_amount) as averageAmount',
        'MAX(envelope.envelope_amount) as maxAmount',
        'MIN(envelope.envelope_amount) as minAmount',
      ])
      .getRawOne();

    const mainEnvelope = await this.envelopesRepository.findOne({
      where: { user_id: { id: userId }, is_main: true, is_active: true },
      select: ['id', 'name', 'envelope_amount'],
    });

    return {
      totalEnvelopes: parseInt(envelopes.totalEnvelopes) || 0,
      totalAmount: parseFloat(envelopes.totalAmount) || 0,
      averageAmount: parseFloat(envelopes.averageAmount) || 0,
      maxAmount: parseFloat(envelopes.maxAmount) || 0,
      minAmount: parseFloat(envelopes.minAmount) || 0,
      mainEnvelope: mainEnvelope
        ? {
            id: mainEnvelope.id,
            name: mainEnvelope.name,
            amount: parseFloat(String(mainEnvelope.envelope_amount)),
          }
        : null,
    };
  }

  /**
   * Detalle de cada sobre con sus entradas y salidas
   */
  async getEnvelopesDetail(userId: string, filters?: DashboardFiltersDto) {
    const envelopes = await this.envelopesRepository.find({
      where: {
        user_id: { id: userId },
        is_active: true,
        ...(filters?.envelopeId && { id: filters.envelopeId }),
      },
      order: { is_main: 'DESC', name: 'ASC' },
    });

    const whereConditions = this.buildWhereConditions(userId, filters);

    const envelopesWithTransactions = await Promise.all(
      envelopes.map(async (envelope) => {
        // Ingresos al sobre (destino)
        const incomes = await this.transactionsRepository
          .createQueryBuilder('transaction')
          .where('transaction.envelope_destination = :envelopeId', {
            envelopeId: envelope.id,
          })
          .andWhere('transaction.user_id = :userId', { userId })
          .andWhere('transaction.type = :type', { type: 'income' })
          .andWhere(whereConditions)
          .select('SUM(transaction.amount)', 'total')
          .addSelect('COUNT(transaction.id)', 'count')
          .getRawOne();

        // Gastos desde el sobre (origen o destino dependiendo del caso)
        const expenses = await this.transactionsRepository
          .createQueryBuilder('transaction')
          .where('transaction.envelope_destination = :envelopeId', {
            envelopeId: envelope.id,
          })
          .andWhere('transaction.user_id = :userId', { userId })
          .andWhere('transaction.type = :type', { type: 'expense' })
          .andWhere(whereConditions)
          .select('SUM(transaction.amount)', 'total')
          .addSelect('COUNT(transaction.id)', 'count')
          .getRawOne();

        // Transferencias salientes (origen)
        const transfersOut = await this.transactionsRepository
          .createQueryBuilder('transaction')
          .where('transaction.envelope_origin = :envelopeId', {
            envelopeId: envelope.id,
          })
          .andWhere('transaction.user_id = :userId', { userId })
          .andWhere('transaction.type = :type', { type: 'transfer' })
          .andWhere(whereConditions)
          .select('SUM(transaction.amount)', 'total')
          .addSelect('COUNT(transaction.id)', 'count')
          .getRawOne();

        // Transferencias entrantes (destino)
        const transfersIn = await this.transactionsRepository
          .createQueryBuilder('transaction')
          .where('transaction.envelope_destination = :envelopeId', {
            envelopeId: envelope.id,
          })
          .andWhere('transaction.user_id = :userId', { userId })
          .andWhere('transaction.type = :type', { type: 'transfer' })
          .andWhere(whereConditions)
          .select('SUM(transaction.amount)', 'total')
          .addSelect('COUNT(transaction.id)', 'count')
          .getRawOne();

        const totalIncome = parseFloat(incomes.total || '0');
        const totalExpense = parseFloat(expenses.total || '0');
        const totalTransfersOut = parseFloat(transfersOut.total || '0');
        const totalTransfersIn = parseFloat(transfersIn.total || '0');

        return {
          envelope: {
            id: envelope.id,
            name: envelope.name,
            description: envelope.description,
            currentAmount: parseFloat(String(envelope.envelope_amount)),
            isMain: envelope.is_main,
          },
          incomes: {
            total: totalIncome,
            count: parseInt(incomes.count || '0'),
          },
          expenses: {
            total: totalExpense,
            count: parseInt(expenses.count || '0'),
          },
          transfersOut: {
            total: totalTransfersOut,
            count: parseInt(transfersOut.count || '0'),
          },
          transfersIn: {
            total: totalTransfersIn,
            count: parseInt(transfersIn.count || '0'),
          },
          netMovement:
            totalIncome + totalTransfersIn - totalExpense - totalTransfersOut,
        };
      }),
    );

    return envelopesWithTransactions;
  }

  /**
   * Resumen de transferencias entre sobres
   */
  async getTransfersSummary(userId: string, filters?: DashboardFiltersDto) {
    const whereConditions = this.buildWhereConditions(userId, filters);

    const transfersData = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .leftJoin('transaction.envelope_origin', 'origin')
      .leftJoin('transaction.envelope_destination', 'destination')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.type = :type', { type: 'transfer' })
      .andWhere(whereConditions)
      .select([
        'COUNT(transaction.id) as totalCount',
        'SUM(transaction.amount) as totalAmount',
        'AVG(transaction.amount) as averageAmount',
        'MAX(transaction.amount) as maxAmount',
        'MIN(transaction.amount) as minAmount',
      ])
      .getRawOne();

    // Obtener las rutas de transferencia más frecuentes
    const topRoutes = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .leftJoin('transaction.envelope_origin', 'origin')
      .leftJoin('transaction.envelope_destination', 'destination')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.type = :type', { type: 'transfer' })
      .andWhere(whereConditions)
      .select([
        'origin.name as originName',
        'origin.id as originId',
        'destination.name as destinationName',
        'destination.id as destinationId',
        'COUNT(transaction.id) as count',
        'SUM(transaction.amount) as total',
      ])
      .groupBy('origin.id')
      .addGroupBy('destination.id')
      .addGroupBy('origin.name')
      .addGroupBy('destination.name')
      .orderBy('count', 'DESC')
      .limit(5)
      .getRawMany();

    return {
      summary: {
        totalCount: parseInt(transfersData.totalCount || '0'),
        totalAmount: parseFloat(transfersData.totalAmount || '0'),
        averageAmount: parseFloat(transfersData.averageAmount || '0'),
        maxAmount: parseFloat(transfersData.maxAmount || '0'),
        minAmount: parseFloat(transfersData.minAmount || '0'),
      },
      topRoutes: topRoutes.map((route) => ({
        origin: {
          id: route.originId,
          name: route.originName,
        },
        destination: {
          id: route.destinationId,
          name: route.destinationName,
        },
        count: parseInt(route.count),
        total: parseFloat(route.total),
      })),
    };
  }

  /**
   * Transferencias recientes
   */
  async getRecentTransfers(userId: string, limit: number = 10) {
    const transfers = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.envelope_origin', 'origin')
      .leftJoinAndSelect('transaction.envelope_destination', 'destination')
      .where('transaction.user_id = :userId', { userId })
      .andWhere('transaction.type = :type', { type: 'transfer' })
      .orderBy('transaction.createdAt', 'DESC')
      .take(limit)
      .getMany();

    return transfers.map((transfer) => ({
      id: transfer.id,
      amount: parseFloat(String(transfer.amount)),
      description: transfer.description,
      date: transfer.createdAt,
      origin: {
        id: transfer.envelope_origin.id,
        name: transfer.envelope_origin.name,
      },
      destination: {
        id: transfer.envelope_destination.id,
        name: transfer.envelope_destination.name,
      },
    }));
  }

  /**
   * Totales por tipo de transacción
   */
  async getTotalsByType(userId: string, filters?: DashboardFiltersDto) {
    const whereConditions = this.buildWhereConditions(userId, filters);

    const totals = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .where('transaction.user_id = :userId', { userId })
      .andWhere(whereConditions)
      .select([
        'transaction.type as type',
        'SUM(transaction.amount) as total',
        'COUNT(transaction.id) as count',
      ])
      .groupBy('transaction.type')
      .getRawMany();

    const result = {
      income: { total: 0, count: 0 },
      expense: { total: 0, count: 0 },
      transfer: { total: 0, count: 0 },
    };

    totals.forEach((item) => {
      result[item.type] = {
        total: parseFloat(item.total),
        count: parseInt(item.count),
      };
    });

    return {
      ...result,
      balance: result.income.total - result.expense.total,
    };
  }

  /**
   * Transacciones recientes
   */
  async getRecentTransactions(userId: string, limit: number = 10) {
    const transactions = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category_id', 'category')
      .leftJoinAndSelect('transaction.envelope_origin', 'origin')
      .leftJoinAndSelect('transaction.envelope_destination', 'destination')
      .where('transaction.user_id = :userId', { userId })
      .orderBy('transaction.createdAt', 'DESC')
      .take(limit)
      .getMany();

    return transactions.map((transaction) => ({
      id: transaction.id,
      amount: parseFloat(String(transaction.amount)),
      type: transaction.type,
      description: transaction.description,
      date: transaction.createdAt,
      category: {
        id: transaction.category_id.id,
        name: transaction.category_id.name,
      },
      envelope: transaction.envelope_destination
        ? {
            id: transaction.envelope_destination.id,
            name: transaction.envelope_destination.name,
          }
        : null,
    }));
  }

  /**
   * Helper para construir condiciones WHERE según filtros
   */
  private buildWhereConditions(
    userId: string,
    filters?: DashboardFiltersDto,
  ): string {
    const conditions: string[] = ['1=1'];

    if (filters?.startDate && filters?.endDate) {
      conditions.push(
        `transaction.createdAt BETWEEN '${filters.startDate}' AND '${filters.endDate}'`,
      );
    }

    if (filters?.categoryId) {
      conditions.push(`transaction.category_id = '${filters.categoryId}'`);
    }

    return conditions.join(' AND ');
  }
}
