import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDTO, UpdateUserDTO } from 'src/dto/users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async getUsers() {
    return await this.usersRepository.getUsers();
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

  async updateUser(userId: number, updateUser: UpdateUserDTO) {
    const user = await this.usersRepository.findUserById(userId);

    if(!user) {
      throw new Error('User not found');
    } else if (updateUser.password) {
     const hashPassword = bcrypt.hashSync(user.password, 10);
      updateUser = { 
        ...updateUser, 
        password: hashPassword 
      };
    }
    return await this.usersRepository.updateUser(user, updateUser);
  }

  async deleteUser(userId : number) {
    return await this.usersRepository.deleteUser(userId);
  }
}
