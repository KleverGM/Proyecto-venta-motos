import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Provider, ProviderSchema } from './provider.model';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller'; // Asegúrate de que el nombre del archivo coincide

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Provider.name, schema: ProviderSchema }
    ]),
  ],
  providers: [ProviderService],
  controllers: [ProviderController],
  exports: [ProviderService],
})
export class ProviderModule {}