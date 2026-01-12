export type AccountType = 'EFECTIVO' | 'CHEQUES' | 'TRANSFERENCIAS';

export interface Account {
  id: AccountType;
  label: string;
  balance: number;
}

export interface Entity {
  id: string;
  name: string;
  balance: number; // Positive means: Client owes us (Receivable) OR We owe Supplier (Payable). Context depends on type.
}

export interface Transaction {
  id: string;
  date: string; // ISO string
  type: 'TRANSFER' | 'INCOME' | 'EXPENSE' | 'DEBT_INCREASE' | 'RECEIVABLE_INCREASE';
  amount: number;
  description: string;
  source?: string; // Account ID or Entity Name
  destination?: string; // Account ID or Entity Name
}

export interface FinanceData {
  accounts: Account[];
  clients: Entity[];
  suppliers: Entity[];
  transactions: Transaction[];
}

export const INITIAL_ACCOUNTS: Account[] = [
  { id: 'EFECTIVO', label: 'Caja Efectivo', balance: 0 },
  { id: 'CHEQUES', label: 'Caja Cheques', balance: 0 },
  { id: 'TRANSFERENCIAS', label: 'Caja Transferencias', balance: 0 },
];