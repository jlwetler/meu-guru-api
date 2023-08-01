import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from 'src/dto/users.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    return await this.prisma.user.findMany();
  }
}
