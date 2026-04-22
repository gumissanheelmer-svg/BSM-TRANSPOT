import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Revenue, Expense, Salary, Driver, DRIVERS } from '@/types';

// Helpers para dados iniciais (seed)
const POMPILIO = DRIVERS.find((d) => d.name === 'Pompilio')!;
const TITO = DRIVERS.find((d) => d.name === 'Tito')!;

const seedRevenue = (id: string, date: string, driver: Driver): Revenue => ({
  id: `seed-r-${id}`,
  driverId: driver.id,
  driverName: driver.name,
  vehicle: driver.vehicle,
  amount: 3000,
  date,
  createdAt: new Date(date).toISOString(),
});

const seedExpense = (
  id: string,
  date: string,
  driver: Driver,
  type: 'combustivel' | 'manutencao' | 'multas' | 'outros',
  amount: number
): Expense => ({
  id: `seed-e-${id}`,
  vehicle: driver.vehicle,
  type,
  amount,
  date,
  createdAt: new Date(date).toISOString(),
});

const SEED_REVENUES: Revenue[] = [
  seedRevenue('01', '2026-03-16', POMPILIO),
  seedRevenue('02', '2026-03-19', POMPILIO),
  seedRevenue('03', '2026-03-20', TITO),
  seedRevenue('04', '2026-03-22', POMPILIO),
  seedRevenue('05', '2026-03-24', TITO),
  seedRevenue('06', '2026-03-24', POMPILIO),
  seedRevenue('07', '2026-03-27', POMPILIO),
  seedRevenue('08', '2026-03-27', TITO),
  seedRevenue('09', '2026-03-30', POMPILIO),
  seedRevenue('10', '2026-03-31', POMPILIO),
  seedRevenue('11', '2026-03-31', TITO),
  seedRevenue('12', '2026-04-02', POMPILIO),
  seedRevenue('13', '2026-04-02', TITO),
  seedRevenue('14', '2026-04-04', TITO),
  seedRevenue('15', '2026-04-05', POMPILIO),
  seedRevenue('16', '2026-04-06', POMPILIO),
  seedRevenue('17', '2026-04-07', TITO),
  seedRevenue('18', '2026-04-09', POMPILIO),
  seedRevenue('19', '2026-04-10', TITO),
  seedRevenue('20', '2026-04-12', POMPILIO),
  seedRevenue('21', '2026-04-14', TITO),
  seedRevenue('22', '2026-04-14', TITO),
  seedRevenue('23', '2026-04-18', POMPILIO),
  seedRevenue('24', '2026-04-19', TITO),
  seedRevenue('25', '2026-04-21', POMPILIO),
];

const SEED_EXPENSES: Expense[] = [
  seedExpense('01', '2026-02-10', POMPILIO, 'manutencao', 2400), // Filtro e óleo
  seedExpense('02', '2026-03-10', POMPILIO, 'outros', 5520),     // Impostos
  seedExpense('03', '2026-03-16', TITO, 'manutencao', 2400),     // Filtro e óleo
  seedExpense('04', '2026-03-19', TITO, 'outros', 5180),         // Imposto
];

const SEED_VERSION = 1;

interface Store {
  revenues: Revenue[];
  expenses: Expense[];
  salaries: Salary[];
  drivers: Driver[];
  addRevenue: (revenue: Omit<Revenue, 'id' | 'createdAt'>) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  addSalary: (salary: Omit<Salary, 'id' | 'createdAt'>) => void;
  getDriverRevenues: (driverId: string) => Revenue[];
  getDriverExpenses: (driverId: string) => Expense[];
  getVehicleExpenses: (vehicle: string) => Expense[];
  getTotalRevenue: (period?: 'daily' | 'weekly' | 'monthly') => number;
  getTotalExpenses: (period?: 'daily' | 'weekly' | 'monthly') => number;
  getTotalSalaries: (period?: 'monthly') => number;
  getNetProfit: (period?: 'monthly') => number;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const isWithinPeriod = (dateStr: string, period: 'daily' | 'weekly' | 'monthly') => {
  const date = new Date(dateStr);
  const now = new Date();
  
  switch (period) {
    case 'daily':
      return date.toDateString() === now.toDateString();
    case 'weekly':
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return date >= weekAgo && date <= now;
    case 'monthly':
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    default:
      return true;
  }
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      revenues: [],
      expenses: [],
      salaries: [],
      drivers: DRIVERS,

      addRevenue: (revenue) => {
        const newRevenue: Revenue = {
          ...revenue,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ revenues: [...state.revenues, newRevenue] }));
      },

      addExpense: (expense) => {
        const newExpense: Expense = {
          ...expense,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ expenses: [...state.expenses, newExpense] }));
      },

      addSalary: (salary) => {
        const newSalary: Salary = {
          ...salary,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ salaries: [...state.salaries, newSalary] }));
      },

      getDriverRevenues: (driverId) => {
        return get().revenues.filter((r) => r.driverId === driverId);
      },

      getDriverExpenses: (driverId) => {
        const driver = get().drivers.find((d) => d.id === driverId);
        if (!driver) return [];
        return get().expenses.filter((e) => e.vehicle === driver.vehicle);
      },

      getVehicleExpenses: (vehicle) => {
        return get().expenses.filter((e) => e.vehicle === vehicle);
      },

      getTotalRevenue: (period) => {
        const revenues = get().revenues;
        const filtered = period ? revenues.filter((r) => isWithinPeriod(r.date, period)) : revenues;
        return filtered.reduce((sum, r) => sum + r.amount, 0);
      },

      getTotalExpenses: (period) => {
        const expenses = get().expenses;
        const filtered = period ? expenses.filter((e) => isWithinPeriod(e.date, period)) : expenses;
        return filtered.reduce((sum, e) => sum + e.amount, 0);
      },

      getTotalSalaries: (period) => {
        const salaries = get().salaries;
        const filtered = period ? salaries.filter((s) => isWithinPeriod(s.paymentDate, period)) : salaries;
        return filtered.reduce((sum, s) => sum + s.amount, 0);
      },

      getNetProfit: (period) => {
        const revenue = get().getTotalRevenue(period);
        const expenses = get().getTotalExpenses(period);
        const salaries = get().getTotalSalaries(period);
        return revenue - expenses - salaries;
      },
    }),
    {
      name: 'bsm-transport-storage',
    }
  )
);
