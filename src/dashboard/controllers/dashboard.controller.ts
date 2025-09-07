import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { DashboardService } from '@/dashboard/services/dashboard.service';
import { CreateDashboardDto } from '@/dashboard/dto/create-dashboard.dto';
import { UpdateDashboardDto } from '@/dashboard/dto/update-dashboard.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserEntity } from '@/users/entities/user.entity';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt-cookie')) 
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDataDashboard (
    @Req() req: Request
  ) {
    const user = req.user as UserEntity;
    return await this.dashboardService.getDashboardData(user.id)
  }
}
