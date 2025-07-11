import { IsInt, IsNumber, IsOptional, IsString, Min, MaxLength } from 'class-validator';

export class UpdateMotorcycleDto {
  @IsOptional()
  @IsString()
  @MaxLength(100) // Añadir esto
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  year?: number;

  @IsOptional()
  @IsNumber()
  @Min(0) // Añadir esto
  price?: number;
}