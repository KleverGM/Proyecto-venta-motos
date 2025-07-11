import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PriceHistory, PriceHistorySchema } from './price-history.model';
import { PriceHistoryService } from './price-history.service';
import { PriceHistoryController } from './price-history.controller'; // Asegúrate de que el nombre del archivo coincide

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PriceHistory.name, schema: PriceHistorySchema }
    ]),
  ],
  providers: [PriceHistoryService],
  controllers: [PriceHistoryController],
  exports: [PriceHistoryService],
})
export class PriceHistoryModule {}