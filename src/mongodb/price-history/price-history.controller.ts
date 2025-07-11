import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param,
  BadRequestException
} from '@nestjs/common';
import { PriceHistoryService } from './price-history.service';
import { PriceHistory } from './price-history.model';

@Controller('price-history')
export class PriceHistoryController {
  constructor(private readonly priceHistoryService: PriceHistoryService) {}

  @Post()
  async create(@Body() priceData: Partial<PriceHistory>) {
    try {
      return await this.priceHistoryService.create(priceData);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('product/:productId')
  async findByProduct(@Param('productId') productId: string) {
    return this.priceHistoryService.findByProduct(productId);
  }

  @Get('latest/:productId')
  async getLatestPrice(@Param('productId') productId: string) {
    return this.priceHistoryService.getLatestPrice(productId);
  }

  @Get('range/:productId/:startDate/:endDate')
  async getPriceHistoryRange(
    @Param('productId') productId: string,
    @Param('startDate') startDateStr: string,
    @Param('endDate') endDateStr: string
  ) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    if (isNaN(startDate.getTime())) {
      throw new BadRequestException('Fecha de inicio inválida');
    }
    
    if (isNaN(endDate.getTime())) {
      throw new BadRequestException('Fecha de fin inválida');
    }
    
    if (startDate > endDate) {
      throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin');
    }
    
    return this.priceHistoryService.getPriceHistoryRange(productId, startDate, endDate);
  }

  @Get('average/:productId')
  async calculatePriceAverage(@Param('productId') productId: string) {
    return this.priceHistoryService.calculatePriceAverage(productId);
  }
}