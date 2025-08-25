import { Debt } from '../entities/debt.entity';

/**
 * Convierte un array de deudas a formato CSV
 * @param debts Array de deudas a convertir
 * @returns String en formato CSV
 */
export function convertToCSV(debts: Debt[]): string {
  const headers = ['ID', 'Descripción', 'Monto', 'Acreedor', 'Deudor', 'Estado', 'Fecha de creación'];
  
  const rows = debts.map(debt => [
    debt.id,
    debt.description,
    debt.amount.toString(),
    debt.creditor.name || debt.creditor.email,
    debt.debtor.name || debt.debtor.email,
    debt.status,
    debt.createdAt.toISOString().split('T')[0]
  ]);
  
  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}

/**
 * Convierte un array de deudas a formato JSON
 * @param debts Array de deudas a convertir
 * @returns String en formato JSON
 */
export function convertToJSON(debts: Debt[]): string {
  const formattedDebts = debts.map(debt => ({
    id: debt.id,
    description: debt.description,
    amount: debt.amount,
    creditor: {
      id: debt.creditor.id,
      name: debt.creditor.name,
      email: debt.creditor.email
    },
    debtor: {
      id: debt.debtor.id,
      name: debt.debtor.name,
      email: debt.debtor.email
    },
    status: debt.status,
    createdAt: debt.createdAt,
    updatedAt: debt.updatedAt
  }));
  
  return JSON.stringify(formattedDebts, null, 2);
}