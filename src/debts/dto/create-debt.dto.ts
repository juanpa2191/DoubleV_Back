import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDebtDto {
  @ApiProperty({ description: 'Descripción de la deuda', example: 'Préstamo para comprar laptop' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La descripción es requerida' })
  description: string;

  @ApiProperty({ description: 'Monto de la deuda', example: 1000, type: Number })
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @IsPositive({ message: 'El monto debe ser un valor positivo' })
  @IsNotEmpty({ message: 'El monto es requerido' })
  amount: number;

  @ApiProperty({ description: 'ID del acreedor (usuario que presta)', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID('4', { message: 'El ID del acreedor debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del acreedor es requerido' })
  creditorId: string;

  @ApiProperty({ description: 'ID del deudor (usuario que debe)', example: '123e4567-e89b-12d3-a456-426614174001' })
  @IsUUID('4', { message: 'El ID del deudor debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID del deudor es requerido' })
  debtorId: string;
}