import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto, UpdateCategoryActiveDto } from '../dto/update-category.dto';
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

  
  /**
   * Crea una nueva categoría para un usuario
   */
  async createCategory(
    createCategoryDto: CreateCategoryDto, 
    userId: string
  ): Promise<CategoryEntity> {
    const { name, description, isActive } = createCategoryDto;

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const newCategory = this.categoryRepository.create({
      name,
      description,
      isActive: isActive ?? true,
      user,
    });

    return await this.categoryRepository.save(newCategory);
  }


  /**
   * Obtiene todas las categorías de un usuario
   */
  async findAllCategoriesByUser(userId: string): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }


  /**
   * Obtiene todas las categorías activas de un usuario
   */
  async findActiveCategoriesByUser(userId: string): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({
      where: { 
        user: { id: userId },
        isActive: true 
      },
      relations: ['user'],
      order: { name: 'ASC' },
    });
  }


  /**
   * Busca una categoría por ID
   */
  async findOneCategory(userId: string, id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { 
        id,
        user: { id: userId }
      },
      relations: ['user'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }


  /**
   * Busca una categoría activa por ID
   */
  async findActiveCategoryById(id: string, userId: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { 
        id,
        isActive: true,
        user: { id: userId }
      },
      relations: ['user'],
    });

    if (!category) {
      throw new NotFoundException(`Active category with ID ${id} not found`);
    }

    return category;
  }


  /**
   * Actualiza una categoría
   */
  async updateCategory(
    id: string,
    userId: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryEntity> {
    
    const category = await this.categoryRepository.findOne({
      where: { 
        id,
        user: { id: userId }
      }
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    const updatedCategory = this.categoryRepository.merge(category, updateCategoryDto);
    return await this.categoryRepository.save(updatedCategory);
  }


  /**
   * Actualiza el estado activo/inactivo de una categoría
   */
  async updateCategoryActiveStatus(
    id: string, 
    userId: string, 
    updateCategoryActiveDto: UpdateCategoryActiveDto
  ): Promise<UpdateResult> {
    const category = await this.categoryRepository.findOne({
      where: { 
        id,
        user: { id: userId }
      }
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return await this.categoryRepository.update(
      { id, user: { id: userId } },
      { isActive: updateCategoryActiveDto.isActive }
    );
  }


  /**
   * Elimina una categoría (soft delete si BaseEntity lo soporta)
   */
  async removeCategory(id: string, userId: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { 
        id,
        user: { id: userId }
      }
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Si BaseEntity tiene softDelete, usar eso
    // Sino, usar remove
    await this.categoryRepository.remove(category);
  }


  /**
   * Verifica si una categoría tiene transacciones asociadas
   */
  async hasCategoryTransactions(id: string, userId: string): Promise<boolean> {
    const category = await this.categoryRepository.findOne({
      where: { 
        id,
        user: { id: userId }
      },
      relations: ['transactions'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category.transactions && category.transactions.length > 0;
  }
}
