import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Customer } from '../customers/customer.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ select: false, length: 255 })
  password: string;

  @Column({ 
    type: 'enum', 
    enum: ['admin', 'customer'], 
    default: 'customer' 
  })
  role: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToOne(() => Customer, customer => customer.user, {
    cascade: true, // Elimina customer al eliminar user
    nullable: true, // Permite usuarios sin perfil de cliente
    onDelete: 'SET NULL' // Comportamiento al eliminar
  })
  @JoinColumn()
  customer: Customer | null; // Permitir valores null
}