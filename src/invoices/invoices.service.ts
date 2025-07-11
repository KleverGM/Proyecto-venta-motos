import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
  ) {}

  create(data: Partial<Invoice>) {
    const invoice = this.invoicesRepository.create(data);
    return this.invoicesRepository.save(invoice);
  }

  findAll() {
    return this.invoicesRepository.find();
  }

  findOne(id: string) {
    return this.invoicesRepository.findOne({ where: { id } });
  }

  update(id: string, data: Partial<Invoice>) {
    return this.invoicesRepository.update(id, data);
  }

  remove(id: string) {
    return this.invoicesRepository.delete(id);
  }
}