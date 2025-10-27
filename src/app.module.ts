import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config';
import { DataSourceConfig } from './config/data.source';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EnvelopesModule } from './envelopes/envelopes.module';
import { TransferModule } from './transfer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.develop.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({ ...DataSourceConfig }),
    UsersModule,
    CategoriesModule,
    AuthModule,
    TransactionsModule,
    DashboardModule,
    EnvelopesModule,
    TransferModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
