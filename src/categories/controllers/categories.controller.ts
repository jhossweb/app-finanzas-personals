import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Request } from 'express';

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


  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
