import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException, HttpException } from '@nestjs/common';

const mockUsersRepository = {
  getUsers: jest.fn(),
  createUser: jest.fn(),
  getUserByEmail: jest.fn(),
  getUserByName: jest.fn(),
  findUserById: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        PrismaService,
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return an empty array when there are no users', async () => {
      const mockUsers = [];
      mockUsersRepository.getUsers.mockResolvedValue({
        users: mockUsers,
        totalUsers: 0,
      });

      const result = await usersController.getUsers({
        page: '1',
        pageSize: '10',
      });

      expect(mockUsersRepository.getUsers).toHaveBeenCalledWith({
        page: '1',
        pageSize: '10',
      });
      expect(result).toEqual({ users: [], totalUsers: 0 });
    });
    it('should return an array of users', async () => {
      const mockUsers = [
        { id: 1, name: 'Jose Geraldo', email: 'josegeraldo@example.com' },
        { id: 2, name: 'Maria Silva', email: 'mariasilva@example.com' },
        { id: 3, name: 'Joao Faria', email: 'joaofaria@example.com' },
      ];
      mockUsersRepository.getUsers.mockResolvedValue({
        users: mockUsers,
        totalUsers: 3,
      });

      const result = await usersController.getUsers({
        page: '1',
        pageSize: '10',
      });

      expect(mockUsersRepository.getUsers).toHaveBeenCalledWith({
        page: '1',
        pageSize: '10',
      });
      expect(result).toEqual({ users: mockUsers, totalUsers: 3 });
    });
  });

  describe('getUserByName', () => {
    it('should return an array of users matching the name', async () => {
      const name = 'Maria';
      const mockMariaUsers = [
        { id: 2, name: 'Maria Silva', email: 'mariasilva@example.com' },
        { id: 6, name: 'Maria Souza', email: 'mariasouza@example.com' },
        { id: 9, name: 'Maria Pereira', email: 'mariapereira@example.com' },
      ];
      mockUsersRepository.getUserByName.mockResolvedValue(mockMariaUsers);
      const result = await usersController.getUserByName(name);

      expect(mockUsersRepository.getUserByName).toHaveBeenCalledWith(name);
      expect(result).toEqual(mockMariaUsers);
    });

    it('should return an empty array when no users match the name', async () => {
      const name = 'Invalid Name';
      mockUsersRepository.getUserByName.mockResolvedValue([]);

      const result = await usersController.getUserByName(name);

      expect(mockUsersRepository.getUserByName).toHaveBeenCalledWith(name);
      expect(result).toEqual([]);
    });
  });

  describe('getUserByEmail', () => {
    it('should return user when receives a valid email', async () => {
      const email = 'joaolucas@example.com';

      const user = {
        id: 1,
        name: 'Joao Lucas',
        email: 'joaolucas@example.com',
      };
      mockUsersRepository.getUserByEmail.mockResolvedValue([user]);

      const result = await usersController.getUserByEmail(email);

      expect(mockUsersRepository.getUserByEmail).toHaveBeenCalledWith(email);
      expect(result[0]).toEqual(user);
    });

    it('should return an empty array when an invalid email is provided', async () => {
      const email = 'invalid_email@example.com';
      mockUsersRepository.getUserByEmail.mockResolvedValue([]);

      const result = await usersController.getUserByEmail(email);

      expect(mockUsersRepository.getUserByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual([]);
    });
  });
  describe('createUser', () => {
    it('should throw a BadRequestException when an email or CPF already in use', async () => {
      const createUserDTO = {
        name: 'Antonio Nunes',
        email: 'antonionunes@example.com',
        password: 'securepassword',
        cpf: '12345678901',
        phone: '555-1234',
      };
      mockUsersRepository.createUser.mockRejectedValue({
        code: 'P2002',
        meta: { target: 'email' },
      });

      try {
        await usersController.createUser(createUserDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('email already in use');
      }
    });
  });
  describe('deleteUser', () => {
    it('should delete a user when a valid user ID is provided', async () => {
      const userId = 1;
      mockUsersRepository.deleteUser.mockResolvedValue({
        id: userId,
        name: 'Joaquim Furtado',
        email: 'joaquim@example.com',
      });

      const result = await usersController.deleteUser(userId);

      expect(mockUsersRepository.deleteUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        id: userId,
        name: 'Joaquim Furtado',
        email: 'joaquim@example.com',
      });
    });

    it('should throw an HttpException when an invalid user ID is provided', async () => {
      const userId = 999;
      mockUsersRepository.deleteUser.mockResolvedValue(null);

      try {
        await usersController.deleteUser(userId);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toEqual(404);
      }
    });
  });

  describe('updateUser', () => {
    it('should update na user when a valid user ID and valid data are provided', async () => {
      const userId = 1;
      const updateUserDTO = {
        email: 'new_email@example.com',
        phone: '27995431183',
      };
      const updatedUser = {
        id: userId,
        name: 'Jose Geraldo',
        email: 'new_email@example.com',
        phone: '27995431183',
      };
      mockUsersRepository.findUserById.mockResolvedValue({
        id: userId,
        name: 'Jose Geraldo',
        email: 'josegeraldo@example.com',
        phone: '27994712274',
      });
      mockUsersRepository.updateUser.mockResolvedValue(updatedUser);

      const result = await usersController.updateUser(userId, updateUserDTO);

      expect(mockUsersRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(mockUsersRepository.updateUser).toHaveBeenCalledWith(
        userId,
        updateUserDTO,
      );
      expect(result).toEqual(updatedUser);
    });

    it('should throw an HttpException when an invalid user ID is provided', async () => {
      const userId = 999;
      const updateUserDTO = {
        email: 'new_email@example.com',
        phone: '27995431183',
      };
      mockUsersRepository.findUserById.mockResolvedValue(null);

      try {
        await usersController.updateUser(userId, updateUserDTO);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toEqual(404);
      }
    });
  });
});
