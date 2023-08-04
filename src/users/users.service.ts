import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDTO, UpdateUserDTO } from 'src/dto/users.dto';
import * as bcrypt from 'bcrypt';
import { PaginationDTO } from 'src/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getUsers(pagination: PaginationDTO) {
    return await this.usersRepository.getUsers(pagination);
  }

  async createUser(user: CreateUserDTO) {
    const hashPassword = bcrypt.hashSync(user.password, 10);
    user = { 
      ...user, 
      password: hashPassword 
    };
    return await this.usersRepository.createUser(user);
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.getUserByEmail(email);
  }

  async getUserByName(name: string) {
    return await this.usersRepository.getUserByName(name);
  }

  async updateUser(userId: number, updateUser: UpdateUserDTO) {
    const user = await this.usersRepository.findUserById(userId);
    
    if (updateUser.password) {
     const hashPassword = bcrypt.hashSync(user.password, 10);
      updateUser = { 
        ...updateUser, 
        password: hashPassword 
      };
    }
    return await this.usersRepository.updateUser(userId, updateUser);
  }

  async deleteUser(userId : number) {
    return await this.usersRepository.deleteUser(userId);
  }
}
