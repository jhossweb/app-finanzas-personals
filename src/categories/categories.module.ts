import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoriesService } from './services/categories.service';
import { CategoriesController } from './controllers/categories.controller';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/services/users.service';
import { CategoryEntity } from './entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoryEntity,
      UserEntity, // Importing UserEntity to use in the service
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, UsersService],
})
export class CategoriesModule {}
