import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Debt, DebtStatus } from './entities/debt.entity';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class DebtsService {
  constructor(
    @InjectRepository(Debt)
    private debtsRepository: Repository<Debt>,
    private usersService: UsersService,
  ) {}

  async create(createDebtDto: CreateDebtDto): Promise<Debt> {
    const { creditorId, debtorId, amount } = createDebtDto;

    if (amount <= 0) {
      throw new BadRequestException('El monto debe ser un valor positivo');
    }

    const creditor = await this.usersService.findOne(creditorId);
    const debtor = await this.usersService.findOne(debtorId);

    const debt = this.debtsRepository.create({
      ...createDebtDto,
      creditor,
      debtor,
      status: DebtStatus.PENDING,
    });

    return this.debtsRepository.save(debt);
  }

  async findAll(): Promise<Debt[]> {
    return this.debtsRepository.find({
      relations: ['creditor', 'debtor'],
    });
  }

  async findOne(id: string): Promise<Debt> {
    const debt = await this.debtsRepository.findOne({
      where: { id },
      relations: ['creditor', 'debtor'],
    });

    if (!debt) {
      throw new NotFoundException('Deuda no encontrada');
    }

    return debt;
  }

  async findByUser(userId: string, status?: DebtStatus): Promise<Debt[]> {
    const queryBuilder = this.debtsRepository.createQueryBuilder('debt')
      .leftJoinAndSelect('debt.creditor', 'creditor')
      .leftJoinAndSelect('debt.debtor', 'debtor')
      .where('creditor.id = :userId OR debtor.id = :userId', { userId });

    if (status) {
      queryBuilder.andWhere('debt.status = :status', { status });
    }

    return queryBuilder.getMany();
  }

  async update(id: string, updateDebtDto: UpdateDebtDto): Promise<Debt> {
    const debt = await this.findOne(id);

    if (debt.status === DebtStatus.PAID) {
      throw new BadRequestException('No se puede modificar una deuda pagada');
    }

    if ('amount' in updateDebtDto && typeof updateDebtDto.amount === 'number' && updateDebtDto.amount <= 0) {
      throw new BadRequestException('El monto debe ser un valor positivo');
    }

    Object.assign(debt, updateDebtDto);

    return this.debtsRepository.save(debt);
  }

  async markAsPaid(id: string): Promise<Debt> {
    const debt = await this.findOne(id);

    debt.status = DebtStatus.PAID;

    return this.debtsRepository.save(debt);
  }

  async remove(id: string): Promise<void> {
    const debt = await this.findOne(id);

    if (debt.status === DebtStatus.PAID) {
      throw new BadRequestException('No se puede eliminar una deuda pagada');
    }

    await this.debtsRepository.remove(debt);
  }

  async getTotalDebtsByStatus(userId: string, status: DebtStatus): Promise<number> {
    const result = await this.debtsRepository.createQueryBuilder('debt')
      .leftJoin('debt.debtor', 'debtor')
      .where('debtor.id = :userId', { userId })
      .andWhere('debt.status = :status', { status })
      .select('SUM(debt.amount)', 'total')
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  async getTotalCreditsByStatus(userId: string, status: DebtStatus): Promise<number> {
    const result = await this.debtsRepository.createQueryBuilder('debt')
      .leftJoin('debt.creditor', 'creditor')
      .where('creditor.id = :userId', { userId })
      .andWhere('debt.status = :status', { status })
      .select('SUM(debt.amount)', 'total')
      .getRawOne();

    return parseFloat(result.total) || 0;
  }
}