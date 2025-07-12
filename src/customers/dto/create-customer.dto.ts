import { IsNotEmpty, IsOptional, IsString, MinLength, IsEmail } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @MinLength(3)
  @IsString()
  name: string;  // Cambiado a 'name' para coincidir con la entidad Customer

  @IsNotEmpty()
  @IsEmail()
  email: string;  // Propiedad requerida para coincidir con la entidad

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;  // Cambiado a 'profileImage' para coincidir con la entidad
}