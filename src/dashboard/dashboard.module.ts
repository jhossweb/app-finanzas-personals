import { Module } from '@nestjs/common';
import { DashboardService } from './services/dashboard.service';
import { DashboardController } from './controllers/dashboard.controller';
import { TransactionsModule } from '@/transactions/transactions.module';
import { TransactionsService } from '@/transactions/services/transactions.service';
import { UsersService } from '@/users/services/users.service';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [TransactionsModule, UsersModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
