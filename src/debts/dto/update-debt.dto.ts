import { PartialType } from '@nestjs/mapped-types';
import { CreateDebtDto } from './create-debt.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { DebtStatus } from '../entities/debt.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDebtDto extends PartialType(CreateDebtDto) {
  @ApiProperty({ description: 'Estado de la deuda', enum: DebtStatus, enumName: 'DebtStatus', required: false, example: 'paid' })
  @IsEnum(DebtStatus, { message: 'El estado debe ser "pending" o "paid"' })
  @IsOptional()
  status?: DebtStatus;
}