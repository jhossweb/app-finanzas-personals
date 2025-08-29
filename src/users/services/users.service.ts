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

  async findAll() {
    try {
      const users = await this.userRepository.find();
      if (!users) throw new NotFoundException('No users found');
      return users;
    } catch (error) {
      throw new InternalServerErrorException(`Error retrieving users: ${error.message}`);
    }
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
   * Finds a user by their username.
   * @param username - The username of the user to find.
   * @returns The user entity if found, otherwise null.
   */
  async findByUsername(username: string): Promise<UserEntity | null> {
    try {
      return await this.userRepository.findOne({ where: { username } });
    } catch (error) {
      throw new Error(`Error finding user by username: ${error.message}`);
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
