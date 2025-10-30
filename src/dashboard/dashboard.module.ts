import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './services/dashboard.service';
import { DashboardController } from './controllers/dashboard.controller';
import { TransactionEntity } from '@/transactions/entities/transaction.entity';
import { EnvelopeEnity } from '@/envelopes/entities/envelope.entity';
import { TransactionsModule } from '@/transactions/transactions.module';
import { EnvelopesModule } from '@/envelopes/envelopes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity, EnvelopeEnity]),
    TransactionsModule,
    EnvelopesModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
