import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionEntity } from '../entities/transaction.entity';
import { CategoriesService } from '@/categories/services/categories.service';
import { NotFoundError } from 'rxjs';
import { parse } from 'path';
import { EnvelopesService } from '@/envelopes/services/envelopes.service';




@Injectable()
export class TransactionsService {

  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,

    private readonly categoryService: CategoriesService,
    private readonly envelopeService: EnvelopesService
  ) {}

  // ------------------------------------------------------------------------------------------------
      // Lógica de Validación (Ayuda a mantener la integridad)
      // ------------------------------------------------------------------------------------------------
      private async validateTypeTransaction(dataDto: CreateTransactionDto) {
        switch (dataDto.type) {
          case 'income':
            if(dataDto.envelope_origin) throw new BadRequestException('Envelope origin is not required for income transactions');
            if(!dataDto.envelope_destination) throw new BadRequestException('Envelope destination is required for income transactions');

            break;
          case 'expense':
              if(dataDto.envelope_origin) throw new BadRequestException("Envelope origin is not required for expense transactions")
              if(!dataDto.envelope_destination) throw new BadRequestException("Envelope destination is required for expense transactions")

                break;
          case 'transfer':
              if(!dataDto.envelope_origin || !dataDto.envelope_destination) throw new BadRequestException("The TRANSFER must have an origin and destination envelope.")
              if(dataDto.envelope_destination === dataDto.envelope_origin) throw new BadRequestException("The origin and destination envelopes cannot be the same.")
              break;
        }
      
    }

  private async applyEnvelopeAdjustments (data: CreateTransactionDto) {
    switch (data.type) {
      case 'income':
        if(!data.envelope_destination) throw new BadRequestException('Envelope destination is required for income transactions')
        
        await this.envelopeService.addAmountToEnvelope(data.envelope_destination, data.amount);
        break

      case 'expense':
        if(!data.envelope_destination) throw new BadRequestException('Envelope origin is required for expense transactions')

        await this.envelopeService.subtractAmountFromEnvelope(data.envelope_destination, data.amount);
        break;

      case 'transfer':
        if(!data.envelope_origin || !data.envelope_destination) throw new BadRequestException('The TRANSFER must have an origin and destination envelope')
        if(data.envelope_destination === data.envelope_origin) throw new BadRequestException('The origin and destination envelopes cannot be the same')

        await this.envelopeService.updateAmountEnvelopes(data.envelope_origin, data.envelope_destination, data.amount);
        break;
    }
  }


  async create(dataDto: CreateTransactionDto, user_id: string) 
  {

    const category = await this.categoryService.findOneCategory(user_id, String(dataDto.category_id));
    if (!category) throw new NotFoundException(`Category with ID ${dataDto.category_id} not found`);
    
    await this.validateTypeTransaction(dataDto);
    
    const transaction = this.transactionRepository.create({
      ...dataDto,
      user_id: { id: user_id }, 
      category_id: category,
      envelope_origin: dataDto.envelope_origin ? { id: dataDto.envelope_origin } : undefined,
      envelope_destination: dataDto.envelope_destination ? { id: dataDto.envelope_destination } : undefined,
    });

    
    try {
      
      const savedTransaction = await this.transactionRepository.save(transaction);

      await this.applyEnvelopeAdjustments(dataDto);
      return savedTransaction;

    }
    catch (error) {
      console.error('Error saving transaction:', error);
      throw new Error('Failed to create transaction');
    }
    
  }


    

  findAll() {
    return `This action returns all transactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  async findByCategory(categoryId: string) {
    return await this.transactionRepository.find({
      where: { category_id: { id: categoryId } },
      relations: ['category_id', 'user_id'], // Adjust relations as necessary
    });
  }

  async findByUser(userId: string) {
    return await this.transactionRepository.find({
      where: { user_id: { id: userId } },
      relations: ['user_id', 'category_id'], // Adjust relations as necessary
    });
  }

  
  async update(id: string, updateTransactionDto: UpdateTransactionDto, user_id: string): Promise<UpdateResult> {
    try {
      const updateData = {
        ...updateTransactionDto,
        envelope_origin: updateTransactionDto.envelope_origin ? { id: updateTransactionDto.envelope_origin } : undefined,
        envelope_destination: updateTransactionDto.envelope_destination ? { id: updateTransactionDto.envelope_destination } : undefined,
      };
      return await this.transactionRepository.update({ id, user_id: { id: user_id } }, updateData);
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw new Error('Failed to update transaction');
    }
  }

  async remove(id: string, user_id: string): Promise<DeleteResult> {
    try {
      return await this.transactionRepository.delete({ id, user_id: { id: user_id } });
    }
    catch (error) {
      console.error('Error deleting transaction:', error);
      throw new Error('Failed to delete transaction');
    }
  }

 

  /**
   * Información para el dashboard
   */

    async getTransactionsByUser(userId: string): Promise<TransactionEntity[]> {

      try {

        const transactions = await this.transactionRepository.find({
          where: { user_id: { id: userId } },
          relations: ['user_id', 'category_id'],
        });

        if (!transactions) throw new BadRequestException('No transactions found for the user');

        return transactions;

      } catch (error) {
        console.error('Error fetching transactions:', error);
        throw new Error('Failed to fetch transactions');
      }

    }

    async getTotalIngresos(userId: string): Promise<number> {
        try {
          const result = await this.transactionRepository
            .createQueryBuilder('transaction')
            .leftJoin('transaction.category_id', 'category') // Asumiendo que la relación se llama 'category'*
            .select('SUM(transaction.amount)', 'total')
            .where('transaction.user_id = :userId', { userId })
            .andWhere('category.type = :type', { type: 'INGRESOS' })
            .getRawOne();
            console.log(result)
      

          return parseFloat(result?.total) || 0;

        } catch (error) {
          console.error('Error fetching total ingresos:', error);
          throw new Error('Failed to fetch transactions');
        }
      }


    async getTotalGastos(userId: string): Promise<number> {
      try {

        const result = await this.transactionRepository
                      .createQueryBuilder('transaction')
                     .leftJoin('transaction.category_id', 'category')
                     .select([
                        'transaction.amount',
                        'transaction.description',
                        'transaction.date',
                        'category.name', // Seleccionamos el nombre de la categoría a través del alias
                      ])
                      .where('transaction.user_id = :userId', { userId })
                      .andWhere('category.type = :type', { type: 'GASTOS' })
                      .select('SUM(transaction.amount)', 'total')
                      .getRawOne();

        return parseFloat(result.total)  || 0  
                      

      } catch (error) {
        throw new Error('Failed to fetch transactions');
      }
    }

    async getTotalTransactionCount(userId: string): Promise<number> {
      try {
        const count = await this.transactionRepository.count({
          where: { user_id: { id: userId } },
        });
        return count;
      } catch (error) {
        throw new Error('Failed to fetch transactions');
      }
    }

    // Método para el recuadro "Transacciones Recientes"

   async getRecentTransactions(userId: string) {
      try {
        const transactions = await this.transactionRepository
          .createQueryBuilder('transaction')
          .leftJoin('transaction.category_id', 'category') // Usamos leftJoin si no necesitas todas las columnas de category
          .select([
            'transaction.id',
            'transaction.amount',
            'transaction.createdAt',
            'transaction.description',
            'category.name', // Solo esta columna de la categoría
            'category.type', // Solo esta columna de la categoría
          ])
          .where('transaction.user_id = :userId', { userId })
          .orderBy('transaction.createdAt', 'DESC')
          .take(5)
          .getRawMany(); // getRawMany para obtener solo los campos seleccionados

        return transactions;
      } catch (error) {
        console.error('Error fetching recent transactions:', error);
        throw new Error('Failed to fetch transactions');
      }
    }

    async getGastoByCategory(userId: string) {
      try {
        const result = await this.transactionRepository
          .createQueryBuilder('transaction')
          .leftJoinAndSelect('transaction.category_id', 'category')
          .select([
            'transaction.id',
            'transaction.amount',
            'transaction.createdAt',
            'transaction.description',
            'category.name', // Solo esta columna de la categoría
            'category.type', // Solo esta columna de la categoría
          ])
          .where('transaction.user_id = :userId', { userId })
          .andWhere('category.type = :type', { type: 'GASTOS' })
         
          .addSelect('SUM(transaction.amount)', 'total')
          .groupBy('category.name')
          .getRawMany();

          return result.map(row => ({
            category: row.categoryName,
            total: parseFloat(row.total)
          }))

      } catch (error) {
        throw new Error('Failed to fetch transactions');
      }
    }

    async getTransactionsByCategory(userId: string) {

      try {
        const result = await this.transactionRepository
          .createQueryBuilder('transaction')
          .leftJoinAndSelect('transaction.category_id', 'category')
          .select('category.name', 'categoryName')
          .addSelect('category.type', 'categoryType')
          .addSelect('transaction.description', 'description')
          .addSelect('transaction.createdAt', 'categoryType')
          .addSelect('SUM(transaction.amount)', 'total')
          .where('transaction.user_id = :userId', { userId })
          .groupBy('category.name')
          .addGroupBy('category.type')
          .getRawMany();
          
          if(!result) throw new BadRequestException('No transactions found for the user');

          return result.map(row => ({
            category: row.categoryName,
            type: row.categoryType,
            total: parseFloat(row.total)
          }))
          
      } catch (error) {
        throw new Error('Failed to fetch transactions');
      }

    }

}
