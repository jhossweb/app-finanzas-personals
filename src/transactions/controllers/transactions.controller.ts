import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';


import { TransactionsService } from '@/transactions/services/transactions.service';
import { CreateTransactionDto } from '@/transactions/dto/create-transaction.dto';
import { UpdateTransactionDto } from '@/transactions/dto/update-transaction.dto';
import { UserEntity } from '@/users/entities/user.entity';



@Controller('transactions')
@UseGuards(AuthGuard('jwt-cookie')) // Ensure that all routes are protected by JWT authentication
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}
  
  @Post()
  create(
    @Body() createTransactionDto: CreateTransactionDto,
    //@CurrentUser('token') user: { id: string }
    @Req() req: Request
  ) {
    const user = req.user as UserEntity
    return this.transactionsService.create(createTransactionDto, user.id) ;
  }

  @Get()
  findAll() {
    
    return this.transactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(+id);
  }

  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId') categoryId: string) {
    return await this.transactionsService.findByCategory(categoryId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto, @Req() req: Request) {
    const user = req.user as UserEntity;
    return this.transactionsService.update(id, updateTransactionDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as UserEntity;
    return this.transactionsService.remove(id, user.id);
  }
}
