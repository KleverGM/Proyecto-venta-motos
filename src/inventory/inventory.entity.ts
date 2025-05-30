import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Motorcycle } from '../motorcycles/motorcycle.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Motorcycle, { eager: true })
  motorcycle: Motorcycle;

  @Column('int')
  quantity: number;

  @Column({ type: 'decimal', nullable: true })
  cost?: number;
}
