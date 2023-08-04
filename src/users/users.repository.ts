import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationDTO } from 'src/dto/pagination.dto';
import { CreateUserDTO, UpdateUserDTO } from 'src/dto/users.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers(pagination: PaginationDTO) {
    if (pagination.page && pagination.pageSize) {
      const page = parseInt(pagination.page);
      const pageSize = parseInt(pagination.pageSize);
      const skip = pageSize*(page - 1);
      return await this.prisma.user.findMany({
        skip,
        take: pageSize,
      }) 
    }
    return await this.prisma.user.findMany({
      orderBy: {
        name: 'asc'
      }
    });
  }
  
  async createUser(user: CreateUserDTO) {
    return await this.prisma.user.create({
      data: user
    })
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: {
        email: {
          contains: email,
          mode:'insensitive',
        }
      }
    });
  }

  async getUserByName(name: string) {
    const users =  await this.prisma.user.findMany({
      where: {
        name: {
          startsWith: name, 
          mode: 'insensitive'
        }
      }
    });
    console.log(users);
    return users;
  }

  async findUserById(userId: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    });
  }

  async updateUser(userId: number, updateUser: UpdateUserDTO) {
    return await this.prisma.user.update({
      where: {
        id: userId
      }, data: {
       ...updateUser
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
