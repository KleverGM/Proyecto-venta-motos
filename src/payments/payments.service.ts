import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  create(data: Partial<Payment>) {
    const payment = this.paymentsRepository.create(data);
    return this.paymentsRepository.save(payment);
  }

  findAll() {
    return this.paymentsRepository.find();
  }

  findOne(id: string) {
    return this.paymentsRepository.findOne({ where: { id } });
  }

  update(id: string, data: Partial<Payment>) {
    return this.paymentsRepository.update(id, data);
  }

  remove(id: string) {
    return this.paymentsRepository.delete(id);
  }
}