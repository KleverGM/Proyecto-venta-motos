import { IsOptional, IsString } from 'class-validator';

export class UpdateSaleDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  motorcycle?: string;

  @IsOptional()
  @IsString()
  profile?: string;
}
