import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from './seller.entity';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(Seller)
    private sellersRepository: Repository<Seller>,
  ) {}

  create(data: Partial<Seller>) {
    const seller = this.sellersRepository.create(data);
    return this.sellersRepository.save(seller);
  }

  findAll() {
    return this.sellersRepository.find();
  }

  findOne(id: string) {
    return this.sellersRepository.findOne({ where: { id } });
  }

  update(id: string, data: Partial<Seller>) {
    return this.sellersRepository.update(id, data);
  }

  remove(id: string) {
    return this.sellersRepository.delete(id);
  }
}