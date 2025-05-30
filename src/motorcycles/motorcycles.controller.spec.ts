import { Test, TestingModule } from '@nestjs/testing';
import { MotorcyclesController } from './motorcycles.controller';
import { MotorcyclesService } from './motorcycles.service';

describe('MotorcyclesController', () => {
  let controller: MotorcyclesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MotorcyclesController],
      providers: [{ provide: MotorcyclesService, useValue: {} }],
    }).compile();

    controller = module.get<MotorcyclesController>(MotorcyclesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
