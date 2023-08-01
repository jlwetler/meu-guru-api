import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDTO } from 'src/dto/users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  getUsers() {
    return this.usersRepository.getUsers();
  }

  createUser(user: CreateUserDTO) {
    const hashPassword = bcrypt.hashSync(user.password, 10);
    user = { 
      ...user, 
      password: hashPassword 
    };
    return this.usersRepository.createUser(user);
  }
}
