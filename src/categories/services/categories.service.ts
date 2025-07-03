import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { CategoryEntity } from '../entities/category.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  
  
  async createParentCategory(
    createCategoryDto: CreateCategoryDto, 
    userId: string
  ): Promise<CategoryEntity> {
      const { name, type } = createCategoryDto;

      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) 
        throw new Error(`User with ID ${userId} not found`);  

      const newCategory = this.categoryRepository.create({
        name,
        type: type as CategoryEntity['type'],
        isDefault: true,
        user: { id: userId },
        parent: undefined, // No parent for root categories
      });

      return await this.categoryRepository.save(newCategory);
  }



  async createCategoryPersonal(
    createCategoryDto: CreateCategoryDto,
    userId: string,
    parentId?: string,
  ): Promise<CategoryEntity> {
    
    const { name, type } = createCategoryDto;
    const user = await this.userRepository.findOneBy({ id: userId });
    
    if (!user) 
      throw new Error(`User with ID ${userId} not found`);

    const parentCategory = parentId
      ? await this.categoryRepository.findOneBy({ id: parentId })
      : undefined;

    if (parentId && !parentCategory)
      throw new Error(`Parent category with ID ${parentId} not found`); 

    const newCategory = this.categoryRepository.create({
      name, 
      type: type as CategoryEntity['type'],
      isDefault: false,
      user: { id: userId },
      parent: parentCategory ? { id: parentId } : undefined,
    });

    return await this.categoryRepository.save(newCategory);
  }

  
  
  findAll() {
    return `This action returns all categories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
