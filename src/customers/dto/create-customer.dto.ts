import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @MinLength(3)
  customer_name: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNotEmpty()
  phone_number: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  profile?: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}