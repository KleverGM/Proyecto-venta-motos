import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('motorcycles')
export class Motorcycle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column('decimal')
  price: number;

  @Column({ nullable: true })
  description?: string;
}
