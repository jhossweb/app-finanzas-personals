import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionEntity } from '../entities/transaction.entity';

@Injectable()
export class TransactionsService {

  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async create(dataDto: CreateTransactionDto, user_id: string) {
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
    return this.transactionRepository.find({
      where: { category_id: { id: categoryId } },
      relations: ['category_id', 'user_id'], // Adjust relations as necessary
    });
  }

  
  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
