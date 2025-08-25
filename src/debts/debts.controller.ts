import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Res, HttpStatus } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { DebtStatus } from './entities/debt.entity';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { convertToCSV, convertToJSON } from './utils/export.utils';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('debts')
@ApiBearerAuth()
@Controller('debts')
@UseGuards(JwtAuthGuard)
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @ApiOperation({ summary: 'Crear una nueva deuda' })
  @ApiResponse({ status: 201, description: 'Deuda creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @Post()
  create(@Body() createDebtDto: CreateDebtDto) {
    return this.debtsService.create(createDebtDto);
  }

  @ApiOperation({ summary: 'Obtener todas las deudas' })
  @ApiResponse({ status: 200, description: 'Lista de deudas' })
  @Get()
  findAll() {
    return this.debtsService.findAll();
  }

  @ApiOperation({ summary: 'Obtener deudas por usuario' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiQuery({ name: 'status', enum: DebtStatus, required: false })
  @ApiResponse({ status: 200, description: 'Lista de deudas del usuario' })
  @Get('user/:userId')
  findByUser(
    @Param('userId') userId: string,
    @Query('status') status?: DebtStatus,
  ) {
    return this.debtsService.findByUser(userId, status);
  }

  @ApiOperation({ summary: 'Obtener una deuda por ID' })
  @ApiParam({ name: 'id', description: 'ID de la deuda' })
  @ApiResponse({ status: 200, description: 'Deuda encontrada' })
  @ApiResponse({ status: 404, description: 'Deuda no encontrada' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debtsService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar una deuda' })
  @ApiParam({ name: 'id', description: 'ID de la deuda' })
  @ApiResponse({ status: 200, description: 'Deuda actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Deuda no encontrada' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDebtDto: UpdateDebtDto) {
    return this.debtsService.update(id, updateDebtDto);
  }

  @ApiOperation({ summary: 'Marcar una deuda como pagada' })
  @ApiParam({ name: 'id', description: 'ID de la deuda' })
  @ApiResponse({ status: 200, description: 'Deuda marcada como pagada exitosamente' })
  @ApiResponse({ status: 404, description: 'Deuda no encontrada' })
  @Patch(':id/pay')
  markAsPaid(@Param('id') id: string) {
    return this.debtsService.markAsPaid(id);
  }

  @ApiOperation({ summary: 'Eliminar una deuda' })
  @ApiParam({ name: 'id', description: 'ID de la deuda' })
  @ApiResponse({ status: 200, description: 'Deuda eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Deuda no encontrada' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debtsService.remove(id);
  }


  @ApiOperation({ summary: 'Exportar deudas de un usuario' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiQuery({ name: 'format', enum: ['json', 'csv'], required: false, description: 'Formato de exportación' })
  @ApiQuery({ name: 'status', enum: DebtStatus, required: false, description: 'Estado de las deudas' })
  @ApiResponse({ status: 200, description: 'Archivo exportado exitosamente' })
  @Get('export/:userId')
  async exportDebts(
    @Param('userId') userId: string,
    @Query('format') format: 'json' | 'csv' = 'json',
    @Res() res: Response,
    @Query('status') status?: DebtStatus,
  ) {
    const debts = await this.debtsService.findByUser(userId, status);

    if (format === 'csv') {
      try {
        // Utilizamos nuestra utilidad para convertir a CSV
        const csvData = convertToCSV(debts);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=debts-${userId}.csv`);
        return res.status(HttpStatus.OK).send(csvData);
      } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error al generar CSV' });
      }
    }
    const jsonData = convertToJSON(debts);
    return res.status(HttpStatus.OK).send(jsonData);
  }

  @ApiOperation({ summary: 'Obtener estadísticas de deudas y créditos de un usuario' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
  @Get('stats/:userId')
  async getStats(@Param('userId') userId: string) {
    const pendingDebts = await this.debtsService.getTotalDebtsByStatus(userId, DebtStatus.PENDING);
    const paidDebts = await this.debtsService.getTotalDebtsByStatus(userId, DebtStatus.PAID);
    const pendingCredits = await this.debtsService.getTotalCreditsByStatus(userId, DebtStatus.PENDING);
    const paidCredits = await this.debtsService.getTotalCreditsByStatus(userId, DebtStatus.PAID);

    return {
      debts: {
        pending: pendingDebts,
        paid: paidDebts,
        total: pendingDebts + paidDebts,
      },
      credits: {
        pending: pendingCredits,
        paid: paidCredits,
        total: pendingCredits + paidCredits,
      },
      balance: pendingCredits - pendingDebts,
    };
  }
}