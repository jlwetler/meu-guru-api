import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Delete, BadRequestException, HttpException, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO, UpdateUserDTO } from '../dto/users.dto';
import { PaginationDTO } from '../dto/pagination.dto';

@Controller('users')
export class UsersController {
  
  constructor(private usersService: UsersService) {}

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) userId : number){
    try {
      return await this.usersService.deleteUser(userId)
    } catch (error){
      throw new HttpException(error, error.status);
    }
  }

  @Get()
  async getUsers(
    @Query() pagination?: PaginationDTO
    ) {
    try {
      return await this.usersService.getUsers(pagination);
    } catch (error) {
      throw new HttpException(error, error.status);
    }
  }

  @Get('/email/:email')
  async getUserByEmail(@Param('email') email: string) {
    try {
      return await this.usersService.getUserByEmail(email);
    } catch(error) {
      throw new HttpException(error, error.status);
    }
  }

  @Get('/name/:name')
  async getUserByName(@Param('name') name: string) {
    try {
      return await this.usersService.getUserByName(name);
    } catch(error) {
      throw new HttpException(error, error.status);
    }
  }

  @Post()
  async createUser(@Body() body: CreateUserDTO) {
    try {
      return await this.usersService.createUser(body);
    } catch(error) {
      if(error.code === "P2002") throw new BadRequestException(`${error.meta.target} already in use`);
    }
  }

  @Put(':id')
  async updateUser(@Param('id', ParseIntPipe) userId : number, @Body() updateUser: UpdateUserDTO){
    try {
    return await this.usersService.updateUser(userId, updateUser)
    } catch (error){
      throw new HttpException(error, error.status);
    }
  }
}
