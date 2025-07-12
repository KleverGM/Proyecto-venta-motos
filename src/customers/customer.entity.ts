import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone_number?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  profileImage?: string;

  // Agrega esta nueva propiedad
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToOne(() => User, user => user.customer)
  @JoinColumn()
  user: User;
}