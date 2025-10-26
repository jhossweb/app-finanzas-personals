import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './services/transactions.service';
import { TransactionsController } from './controllers/transactions.controller';
import { TransactionEntity } from './entities/transaction.entity';
import { CategoriesModule } from '../categories/categories.module';
import { EnvelopesModule } from '@/envelopes/envelopes.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    CategoriesModule, // Import CategoriesModule to use CategoriesService
    EnvelopesModule
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
