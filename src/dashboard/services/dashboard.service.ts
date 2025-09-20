import { Injectable } from '@nestjs/common';
import { CreateDashboardDto } from '@/dashboard/dto/create-dashboard.dto';
import { UpdateDashboardDto } from '@/dashboard/dto/update-dashboard.dto';
import { TransactionsService } from '@/transactions/services/transactions.service';
import { UsersService } from '@/users/services/users.service';

@Injectable()
export class DashboardService {

  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly userService: UsersService
  ){}

  create(createDashboardDto: CreateDashboardDto) {
    return 'This action adds a new dashboard';
  }

  findByAuthUser(user: string) {
    return `This action returns all dashboard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dashboard`;
  }

  update(id: number, updateDashboardDto: UpdateDashboardDto) {
    return `This action updates a #${id} dashboard`;
  }

  remove(id: number) {
    return `This action removes a #${id} dashboard`;
  }

  async getDashboardData(user_id: string) {

    const totalIngreso = await this.transactionsService.getTotalIngresos(user_id);
    const totalGasto = await this.transactionsService.getTotalGastos(user_id);
    console.log(totalIngreso)
    const transactionsByCategory = await this.transactionsService.getTransactionsByCategory(user_id);

    const totalTransactions = await this.transactionsService.getTotalTransactionCount(user_id);
    const recentTransactions = await this.transactionsService.getRecentTransactions(user_id);

    const gastosByCategory = await this.transactionsService.getGastoByCategory(user_id);


    const balance = totalIngreso - totalGasto;

    return {
      totalIngreso,
      totalGasto,
      balance,
      transactionsByCategory,
      totalTransactions,
      recentTransactions,
      gastosByCategory
    }
  }
}
