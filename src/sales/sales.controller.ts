import {
  Controller,
  Post as HttpPost,
  Get,
  Param,
  Delete,
  Body,
  Query,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from './sale.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @HttpPost()
  async create(
    @Body() createSaleDto: CreateSaleDto,
  ): Promise<SuccessResponseDto<Sale>> {
    const sale = await this.salesService.create(createSaleDto);
    if (!sale)
      throw new NotFoundException('Motorcycle not found or error creating sale');
    return new SuccessResponseDto('Sale created successfully', sale);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<SuccessResponseDto<Pagination<Sale>>> {
    limit = limit > 100 ? 100 : limit;
    const result = await this.salesService.findAll({ page, limit });

    if (!result)
      throw new InternalServerErrorException('Could not retrieve sales');

    return new SuccessResponseDto('Sales retrieved successfully', result);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<SuccessResponseDto<Sale>> {
    const sale = await this.salesService.findOne(id);
    if (!sale) throw new NotFoundException('Sale not found');
    return new SuccessResponseDto('Sale retrieved successfully', sale);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<SuccessResponseDto<string>> {
    const deleted = await this.salesService.remove(id);
    if (!deleted)
      throw new NotFoundException('Sale not found or could not be deleted');
    return new SuccessResponseDto('Sale deleted successfully', id);
  }
}
