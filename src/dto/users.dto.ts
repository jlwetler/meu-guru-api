import { IsEmail, IsMobilePhone, IsString, IsStrongPassword } from 'class-validator';
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
