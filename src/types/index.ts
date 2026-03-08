export interface Driver {
  id: string;
  name: string;
  vehicle: string;
}

export interface Revenue {
  id: string;
  driverId: string;
  driverName: string;
  vehicle: string;
  amount: number;
  date: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  vehicle: string;
  type: 'combustivel' | 'manutencao' | 'multas' | 'outros';
  amount: number;
  date: string;
  createdAt: string;
}

export interface Salary {
  id: string;
  driverId: string;
  driverName: string;
  amount: number;
  paymentDate: string;
  createdAt: string;
}

export type ExpenseType = 'combustivel' | 'manutencao' | 'multas' | 'outros';

export const EXPENSE_TYPE_LABELS: Record<ExpenseType, string> = {
  combustivel: 'Combustível',
  manutencao: 'Manutenção',
  multas: 'Multas',
  outros: 'Outros',
};

export const DRIVERS: Driver[] = [
  { id: '1', name: 'Pompilio', vehicle: 'Nissan Caravan' },
  { id: '2', name: 'Tito', vehicle: 'Nissan Caravan' },
];

export const VEHICLES = ['Nissan Caravan'];
