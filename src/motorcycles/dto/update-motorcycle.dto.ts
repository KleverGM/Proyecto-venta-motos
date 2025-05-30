import { IsOptional, IsString } from 'class-validator';

export class UpdateMotorcycleDto {
  @IsOptional()
  @IsString()
  name?: string;
}
