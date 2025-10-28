import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpCode, HttpStatus, ParseUUIDPipe, UseGuards, UnauthorizedException, Put } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryActiveDto, UpdateCategoryDto } from '../dto/update-category.dto';
import { Request } from 'express';

import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '@/users/entities/user.entity';
;
import { RolesGuard } from '@/roles/guards/roles.guard';


@Controller('categories')
@UseGuards(AuthGuard('jwt-cookie'), RolesGuard)
export class CategoriesController {

  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getAll( @Req() req: Request ) {

    const user = req.user as UserEntity;
    if (!user) throw new UnauthorizedException('User not authenticated');

    return await this.categoriesService.findAllCategoriesByUser(user.id);
  }


  @Post()
  @HttpCode(HttpStatus.CREATED)

  async createCategoryPersonal(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: Request
  ) {
    const user = req.user as UserEntity;
    if (!user) throw new UnauthorizedException('User not authenticated');
     
    return this.categoriesService.createCategory(createCategoryDto, user.id);
  }


  @Get('personal/:id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.categoriesService.findAllCategoriesByUser(id);
  }

  /** Inactivated Category for user */
  @Patch('personal/:id/active')
  updateCategoryPersonalActive(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateCategoryActiveDto: UpdateCategoryActiveDto,
    @Req() req: Request
  ) {
    const user = req.user as UserEntity;
    if (!user) throw new UnauthorizedException('User not authenticated');

    return this.categoriesService.updateCategory(id, user.id, { isActive: updateCategoryActiveDto.isActive });
  }


}
