import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, IsNull, UpdateResult } from 'typeorm';
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
    userId: string
  ): Promise<CategoryEntity> {
    
    const { name, type } = createCategoryDto;
    const user = await this.userRepository.findOneBy({ id: userId });
    
    if(!user) throw new NotFoundException(`User with ID ${userId} not found`);

    const parentCategory = await this.categoryRepository.findOne({
      where: { id: createCategoryDto.parentId, isDefault: true }
    })

    if (!parentCategory) {
      throw new NotFoundException(`Parent category with ID ${createCategoryDto.parentId} not found`);
    }

    const newCategory = this.categoryRepository.create({
      name,
      type: type as CategoryEntity['type'],
      isDefault: false,
      user: { id: userId },
      parent: parentCategory, // Set the parent category
    });

    return await this.categoryRepository.save(newCategory);
  }

  async findCateogryParent(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({
      where: { isDefault: true, parent: IsNull() }
    });
  }

  
  
  async findAllCategoryChildren(user_id: string): Promise<CategoryEntity[]> {
      return await this.categoryRepository.find({
        where: { isDefault: false, user: { id: user_id } },
        relations: ['user'],
      });
  }

  async findByCategoryActive(category_id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id: category_id, isActive: true },
      relations: ['user'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${category_id} not found`); 
    }

    return category;
  }

  async findOneCategoryPersonal(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id, isDefault: false },
      relations: ['user'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async updateChildrenCategory (
    userId: string,
    updateCategoryDto: UpdateCategoryDto,
    id_category: string
  ): Promise<CategoryEntity> {
    
    // Category for updated
    const category = await this.categoryRepository.findOne({
        where: { id: updateCategoryDto.id, isDefault: false, user: { id: userId} }
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${updateCategoryDto.id} not found`);
    }

    // Ensure type is cast to CategoryEntity['type']
    // Remove or properly set 'user' property for merge
    const { type, ...rest } = updateCategoryDto;
    const updateData = {
      ...rest,
      type: type as CategoryEntity['type'],
      // If you need to update user, use: user: { id: userId }
    };
    const updateCategoryPersonal = await this.categoryRepository.merge(category, updateData);
    const update = await this.categoryRepository.save(updateCategoryPersonal);
    console.log(update)
    return update;

  }

  async updateCategoryPersonalActive(id: string, user_id: string, data: boolean): Promise<UpdateResult> {
    try{
      return await this.categoryRepository.update(
        { id, user: { id: user_id } },
        { isActive: data }
      );
    }catch (error) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
