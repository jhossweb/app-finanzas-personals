import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpCode, HttpStatus, ParseUUIDPipe, UseGuards, UnauthorizedException, Put } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryActive, UpdateCategoryDto } from '../dto/update-category.dto';
import { Request } from 'express';
import { create } from 'domain';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '@/users/entities/user.entity';
import { Roles } from '@/roles/decorators/role.decorator';
import { RolesGuard } from '@/roles/guards/roles.guard';
import { Role } from '@/roles/enum/role.enum';

@Controller('categories')
@UseGuards(AuthGuard('jwt-cookie'), RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('user')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async createParentCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: Request
  ) {
   /* const user = req.user as UserEntity;
    if (!user) throw new UnauthorizedException('User not authenticated'); */

     const user = req.user as { id: string; username: string }; // Tipado del payload
    if (!user || !user.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    return await this.categoriesService.createParentCategory(createCategoryDto, user.id);
  }

  @Post('personal')
  @HttpCode(HttpStatus.CREATED)
  async createCategoryPersonal(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: Request
  ) {
    const user = req.user as UserEntity;
    if (!user) throw new UnauthorizedException('User not authenticated');
     
    return this.categoriesService.createCategoryPersonal(createCategoryDto, user.id);
  }


  @Get()
  async findAll(
    @Req() req: Request
  ) {
    const user = req.user as UserEntity;
    if (!user) throw new UnauthorizedException('User not authenticated');
    
    return await this.categoriesService.findAllCategoryChildren(user.id);
  }

  /* Category Person */
  @Get('personal')
  async findCategoryPersonal(@Req() req: Request) {
    const user = req.user as UserEntity
    return await this.categoriesService.findAllCategoryChildren(user.id);
  }

  @Get('personal/:id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.categoriesService.findOneCategoryPersonal(id);
  }

  /** category personal */
  @Patch('personal/:id')
  update(
    @Req() req: Request,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param('id', ParseUUIDPipe) id: string
  ) {
    const user = req.user as UserEntity;
    if (!user) throw new UnauthorizedException('User not authenticated');
    console.log(`User ID: ${user.id}, Category ID: ${id}, Update Data:`, updateCategoryDto);
    return this.categoriesService.updateChildrenCategory(user.id, updateCategoryDto, id);
  }


  /** Inactivated Category for user */
  @Patch('personal/:id/active')
  updateCategoryPersonalActive(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateCategoryActive: UpdateCategoryActive,
    @Req() req: Request
  ) {
    const user = req.user as UserEntity;
    if (!user) throw new UnauthorizedException('User not authenticated');

    return this.categoriesService.updateCategoryPersonalActive(id, user.id, updateCategoryActive.isActive);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
