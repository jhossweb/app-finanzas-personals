import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionEntity } from '../entities/transaction.entity';
import e from 'express';

@Injectable()
export class TransactionsService {

  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async create(dataDto: CreateTransactionDto, user_id: string): Promise<TransactionEntity> {
    const transaction = this.transactionRepository.create({
      ...dataDto,
      user_id: { id: user_id }, // If 'user' is a relation to UserEntity
      category_id: dataDto.category_id, // Assuming category_id is a UUID or similar identifier
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
}
