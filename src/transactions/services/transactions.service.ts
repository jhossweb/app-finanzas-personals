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

  async create(dataDto: CreateTransactionDto, user_id: string): Promise<TransactionEntity> 
  {

    const category = await this.categoryService.findOneCategoryPersonal(String(dataDto.category_id));
    if (!category) throw new NotFoundException(`Category with ID ${dataDto.category_id} not found`);

    const envelope = await this.envelopeService.findEnvelopeByUserId(String(user_id));
    if (!envelope) throw new NotFoundException(`Envelope with User ID ${user_id} not found`);

    const transaction = this.transactionRepository.create({
      ...dataDto,
      user_id: { id: user_id }, // If 'user_id' is a relation, ensure this matches your entity definition
      category_id: category, 
      envelope: envelope
    });

    try {
      return await this.transactionRepository.save(transaction);
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
      return await this.transactionRepository.update({ id, user_id: { id: user_id } }, updateTransactionDto);
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
