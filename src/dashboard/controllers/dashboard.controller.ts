import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { DashboardService } from '@/dashboard/services/dashboard.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserEntity } from '@/users/entities/user.entity';
import { DashboardFiltersDto } from '../dto/dashboard-filters.dto';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt-cookie'))
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /**
   * Obtener datos completos del dashboard
   * GET /dashboard
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getDashboard(
    @Req() req: Request,
    @Query() filters?: DashboardFiltersDto,
  ) {
    const user = req.user as UserEntity;
    const data = await this.dashboardService.getDashboardData(
      user.id,
      filters,
    );

    return {
      success: true,
      message: 'Dashboard data retrieved successfully',
      data,
    };
  }

  /**
   * Obtener resumen de sobres
   * GET /dashboard/envelopes/summary
   */
  @Get('envelopes/summary')
  @HttpCode(HttpStatus.OK)
  async getEnvelopesSummary(@Req() req: Request) {
    const user = req.user as UserEntity;
    const data = await this.dashboardService.getEnvelopesSummary(user.id);

    return {
      success: true,
      message: 'Envelopes summary retrieved successfully',
      data,
    };
  }

  /**
   * Obtener detalle de sobres con transacciones
   * GET /dashboard/envelopes/detail
   */
  @Get('envelopes/detail')
  @HttpCode(HttpStatus.OK)
  async getEnvelopesDetail(
    @Req() req: Request,
    @Query() filters?: DashboardFiltersDto,
  ) {
    const user = req.user as UserEntity;
    const data = await this.dashboardService.getEnvelopesDetail(
      user.id,
      filters,
    );

    return {
      success: true,
      message: 'Envelopes detail retrieved successfully',
      data,
    };
  }

  /**
   * Obtener resumen de transferencias
   * GET /dashboard/transfers/summary
   */
  @Get('transfers/summary')
  @HttpCode(HttpStatus.OK)
  async getTransfersSummary(
    @Req() req: Request,
    @Query() filters?: DashboardFiltersDto,
  ) {
    const user = req.user as UserEntity;
    const data = await this.dashboardService.getTransfersSummary(
      user.id,
      filters,
    );

    return {
      success: true,
      message: 'Transfers summary retrieved successfully',
      data,
    };
  }

  /**
   * Obtener transferencias recientes
   * GET /dashboard/transfers/recent
   */
  @Get('transfers/recent')
  @HttpCode(HttpStatus.OK)
  async getRecentTransfers(@Req() req: Request, @Query('limit') limit?: number) {
    const user = req.user as UserEntity;
    const data = await this.dashboardService.getRecentTransfers(
      user.id,
      limit || 10,
    );

    return {
      success: true,
      message: 'Recent transfers retrieved successfully',
      data,
    };
  }

  /**
   * Obtener totales por tipo de transacción
   * GET /dashboard/totals
   */
  @Get('totals')
  @HttpCode(HttpStatus.OK)
  async getTotalsByType(
    @Req() req: Request,
    @Query() filters?: DashboardFiltersDto,
  ) {
    const user = req.user as UserEntity;
    const data = await this.dashboardService.getTotalsByType(user.id, filters);

    return {
      success: true,
      message: 'Totals by type retrieved successfully',
      data,
    };
  }

  /**
   * Obtener transacciones recientes
   * GET /dashboard/transactions/recent
   */
  @Get('transactions/recent')
  @HttpCode(HttpStatus.OK)
  async getRecentTransactions(
    @Req() req: Request,
    @Query('limit') limit?: number,
  ) {
    const user = req.user as UserEntity;
    const data = await this.dashboardService.getRecentTransactions(
      user.id,
      limit || 10,
    );

    return {
      success: true,
      message: 'Recent transactions retrieved successfully',
      data,
    };
  }
}
