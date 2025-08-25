import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum DebtStatus {
  PENDING = 'pending',
  PAID = 'paid',
}

export const DebtStatusDescription = {
  PENDING: 'Deuda pendiente de pago',
  PAID: 'Deuda pagada',
}

@Entity('debts')
export class Debt {
  @ApiProperty({ description: 'Identificador único de la deuda', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Descripción de la deuda', example: 'Préstamo para comprar laptop' })
  @Column()
  description: string;

  @ApiProperty({ description: 'Monto de la deuda', example: 1000, type: Number })
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'Usuario acreedor (quien presta)', type: () => User })
  @ManyToOne(() => User, (user) => user.creditorDebts)
  creditor: User;

  @ApiProperty({ description: 'Usuario deudor (quien debe)', type: () => User })
  @ManyToOne(() => User, (user) => user.debtorDebts)
  debtor: User;

  @ApiProperty({ description: 'Estado de la deuda', enum: DebtStatus, enumName: 'DebtStatus', default: DebtStatus.PENDING, example: 'pending' })
  @Column({
    type: 'enum',
    enum: DebtStatus,
    default: DebtStatus.PENDING,
  })
  status: DebtStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}