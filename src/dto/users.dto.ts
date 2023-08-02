import { IsEmail, IsMobilePhone, IsOptional, IsString, IsStrongPassword } from 'class-validator';
import { IsCPF } from 'class-validator-cpf';

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsCPF()
  cpf: string;

  @IsMobilePhone()
  phone: string;
}

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsStrongPassword()
  password?: string;

  @IsOptional()
  @IsCPF()
  cpf?: string;

  @IsOptional()
  @IsMobilePhone()
  phone?: string;
}