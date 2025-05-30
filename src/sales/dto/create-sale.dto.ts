import { IsNotEmpty, IsString } from 'class-validator';
import { Motorcycle } from '../../motorcycles/motorcycle.entity';

export class CreateSaleDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  motorcycle: Motorcycle | string;

  @IsString()
  profile?: string;
}
