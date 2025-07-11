import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreatePriceHistoryDto {
  @IsString({ message: 'productId debe ser una cadena de texto' })
  productId: string;

  @IsNumber({}, { message: 'price debe ser un número' })
  price: number;

  @IsOptional()
  @IsString({ message: 'currency debe ser una cadena de texto' })
  currency?: string;

  @IsOptional()
  @IsDateString({}, { message: 'date debe ser una fecha válida' })
  date?: Date;
}