import { IsNotEmpty, IsInt, Min, IsOptional, IsNumber } from 'class-validator';

export class CreateInventoryDto {
  @IsNotEmpty()
  motorcycle: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  quantity: number;

  @IsOptional()
  @IsNumber()
  cost?: number;
}
