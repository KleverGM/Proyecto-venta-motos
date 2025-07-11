import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Sale } from '../sales/sale.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Sale, { eager: true })
  sale: Sale;

  @Column()
  invoiceNumber: string;

  @Column({ type: 'date' })
  date: Date;

  @Column('decimal')
  total: number;

  @Column({ nullable: true })
  details: string;
}