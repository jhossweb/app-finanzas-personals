import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpCode, HttpStatus, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Request } from 'express';
import { create } from 'domain';
import { AuthGuard } from '@nestjs/passport';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('user/:userId')
  @HttpCode(HttpStatus.CREATED)
  async createParentCategory(
    @Body() createCategoryDto: CreateCategoryDto, 
    @Param('userId', ParseUUIDPipe) userId: string // Assuming req.user contains the authenticated user info
  ) {
    console.log('User ID:', userId,` - ${createCategoryDto}`); // Log the user ID for debugging
    
    return this.categoriesService.createParentCategory(createCategoryDto, userId);
  }

  @Post('personal/:userId')
  @HttpCode(HttpStatus.CREATED)
  async createCategoryPersonal(
    @Body() createCategoryDto: CreateCategoryDto,
    @Param('userId', ParseUUIDPipe) userId: string, // Assuming req
  ) {
    console.log('User ID:', userId, ` - ${createCategoryDto}`); // Log the user ID for debugging
    return this.categoriesService.createCategoryPersonal(createCategoryDto, userId);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.categoriesService.findAllParent();
  }

  /* Category Person */
  @Get('personal/:id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.categoriesService.findOneCategoryPersonal(id);
  }

  /** category personal */
  @Patch('personal/:userId')
  update(
    @Param('userId', ParseUUIDPipe) id: string, 
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoriesService.updateChildrenCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
