import { 
  Injectable, 
  BadRequestException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PriceHistory, PriceHistoryDocument } from './price-history.model';

@Injectable()
export class PriceHistoryService {
  constructor(
    @InjectModel(PriceHistory.name) 
    private readonly priceHistoryModel: Model<PriceHistoryDocument>
  ) {}

  async create(priceData: Partial<PriceHistory>): Promise<PriceHistoryDocument> {
    // Validar campos requeridos
    if (!priceData.productId) {
      throw new BadRequestException('productId is required');
    }
    
    if (priceData.price === undefined) {
      throw new BadRequestException('price is required');
    }

    const newEntry = new this.priceHistoryModel({
      ...priceData,
      date: priceData.date || new Date(), // Usa la fecha actual si no se proporciona
    });
    
    return newEntry.save();
  }

  async findByProduct(productId: string): Promise<PriceHistoryDocument[]> {
    return this.priceHistoryModel
      .find({ productId })
      .sort({ date: -1 })
      .exec();
  }

  async getLatestPrice(productId: string): Promise<number | null> {
    const latestEntry = await this.priceHistoryModel
      .findOne({ productId })
      .sort({ date: -1 })
      .exec();
    
    return latestEntry ? latestEntry.price : null;
  }

  async getPriceHistoryRange(
    productId: string,
    startDate: Date,
    endDate: Date
  ): Promise<PriceHistoryDocument[]> {
    return this.priceHistoryModel
      .find({
        productId,
        date: { $gte: startDate, $lte: endDate }
      })
      .sort({ date: -1 })
      .exec();
  }

  async calculatePriceAverage(productId: string): Promise<number> {
    const result = await this.priceHistoryModel.aggregate([
      { $match: { productId } },
      { $group: { _id: null, average: { $avg: "$price" } } }
    ]).exec();
    
    return result.length > 0 ? result[0].average : 0;
  }
}