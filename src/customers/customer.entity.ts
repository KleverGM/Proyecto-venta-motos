import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('customers')
export class Customer {
  
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  customer_name: string; // Nombre del cliente

  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  @Column()
  phone_number: string; // Número de teléfono

  @Column({ nullable: true })
  address: string; // Dirección

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  profile: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 'customer' })
  role: 'admin' | 'customer';
}
