import { Injectable } from '@nestjs/common';
import { CreateUserDTO, UpdateUserDTO } from 'src/dto/users.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    return await this.prisma.user.findMany();
  }
  
  async createUser(user: CreateUserDTO) {
    return await this.prisma.user.create({
      data: user
    })
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email
      }
    });
  }

  async findUserById(userId: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    });
  }

  async updateUser(user, updateUser: UpdateUserDTO) {
    return await this.prisma.user.update({
      where: {
        id: user.id
      }, data: {
        ...user, ...updateUser
      }
    })
  }

  async deleteUser(userId: number) {
    return await this.prisma.user.delete({
      where: {
        id: userId
      }
    })
  }
}
