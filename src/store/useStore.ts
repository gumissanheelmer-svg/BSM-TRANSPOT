import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Revenue, Expense, Salary, Driver, DRIVERS } from '@/types';

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
