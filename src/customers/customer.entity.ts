import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../auth/user.entity'; // Importar entidad User

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customer_name: string;

  @Column()
  phone_number: string;

  @Column({ nullable: true })
  address?: string; // Opcional

  @Column({ nullable: true })
  profile?: string; // Opcional

  // Relación con User - Corregida para permitir valores null
  @OneToOne(() => User, { 
    nullable: true, // Permitir que sea null
    onDelete: 'SET NULL' // Comportamiento al eliminar
  })
  @JoinColumn()
  user: User | null; // Aceptar null
}