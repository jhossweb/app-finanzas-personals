import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../entities/user.entity';


@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ){}

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string): Promise<UserEntity | string> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new Error(`Error finding user with ID ${id}: ${error.message}`);
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  
  /**
   * Creates a new user.
   * @param createUserDto - The data transfer object containing user details.
   * @returns The created user entity.
   */

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
      const existingUser = await this.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new ConflictException(`User with email ${createUserDto.email} already exists`);
      }
      
      createUserDto.username = createUserDto.username.toLowerCase();
      createUserDto.email = createUserDto.email.toLowerCase();
      createUserDto.password = await this.hashPassword(createUserDto.password);
      
      try {
        return await this.userRepository.save(createUserDto)
      } catch (error) {
        throw new InternalServerErrorException(`Error creating user: ${error.message}`);
      }
  }
  
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt); 
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
