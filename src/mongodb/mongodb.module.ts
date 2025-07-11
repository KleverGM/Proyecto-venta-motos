import { Module } from '@nestjs/common';
import { ProviderModule } from './provider/provider.module';
import { ServiceModule } from './service/service.module';
import { PriceHistoryModule } from './price-history/price-history.module';

@Module({
  imports: [
    ProviderModule,
    ServiceModule,
    PriceHistoryModule,
  ],
  exports: [
    ProviderModule,  // Exporta los submódulos que contienen los servicios
    ServiceModule,
    PriceHistoryModule,
  ],
})
export class MongodbModule {}