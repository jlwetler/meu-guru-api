import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO, UpdateUserDTO } from 'src/dto/users.dto';

@Controller('users')
export class UsersController {
  
  constructor(private usersService: UsersService) {}

  @Get()
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    return await this.usersService.createUser(body);
  }

  @Get(':email')
  async getUserByEmail(@Param('email') email: string) {
    return await this.usersService.getUserByEmail(email);
  }

  @Put(':id')
  async updateUser(@Param('id', ParseIntPipe) userId : number, @Body() updateUser: UpdateUserDTO){
    return await this.usersService.updateUser(userId, updateUser)
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) userId : number){
    return await this.usersService.deleteUser(userId)
  }
}
