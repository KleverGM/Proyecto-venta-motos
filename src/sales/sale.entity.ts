import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Motorcycle } from '../motorcycles/motorcycle.entity';
import { Seller } from '../sellers/seller.entity';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => Motorcycle, { eager: true })
  motorcycle: Motorcycle;

  @Column({ nullable: true })
  profile: string;

  @ManyToOne(() => Seller, seller => seller.sales, { eager: true, nullable: true })
  seller: Seller;
}