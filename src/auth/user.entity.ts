import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Customer } from '../customers/customer.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('simple-array', { default: ['user'] })
  roles: string[];

  @OneToOne(() => Customer, customer => customer.user, { cascade: true })
  @JoinColumn()
  customer: Customer;
}