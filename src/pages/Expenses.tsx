import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { NeonCard } from '@/components/NeonCard';
import { NeonButton } from '@/components/NeonButton';
import { VEHICLES, EXPENSE_TYPE_LABELS, ExpenseType } from '@/types';
import { toast } from 'sonner';
import { Receipt, Calendar, Truck, AlertTriangle } from 'lucide-react';

const HIGH_EXPENSE_THRESHOLD = 500;

export const Expenses = () => {
  const { addExpense } = useStore();
  const [vehicle, setVehicle] = useState('');
  const [expenseType, setExpenseType] = useState<ExpenseType | ''>('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehicle || !expenseType || !amount || !date) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    const amountNum = parseFloat(amount);

    if (amountNum > HIGH_EXPENSE_THRESHOLD) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
    }

    addExpense({
      vehicle,
      type: expenseType as ExpenseType,
      amount: amountNum,
      date,
    });

    toast.success('Despesa adicionada com sucesso!', {
      style: {
        background: '#1a1a1a',
        border: '1px solid #FFA500',
        color: '#fff',
      },
    });

    setVehicle('');
    setExpenseType('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl lg:text-4xl font-orbitron font-bold text-secondary neon-text-purple">
        Registro de Despesas
      </h1>

      {/* High Expense Alert */}
      {showAlert && (
        <div className="max-w-xl mx-auto animate-fade-in-up">
          <div className="flex items-center gap-3 px-4 py-3 bg-destructive/20 border border-destructive rounded-lg">
            <AlertTriangle className="w-6 h-6 text-destructive animate-pulse" />
            <span className="text-destructive font-semibold neon-text-red">
              Alerta: Despesa muito alta registrada!
            </span>
          </div>
        </div>
      )}

      <div className="max-w-xl mx-auto">
        <NeonCard variant="purple" hover={false} className="animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vehicle Select */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Truck className="w-4 h-4 text-secondary" />
                Veículo
              </label>
              <select
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
              >
                <option value="">Selecione um veículo</option>
                {VEHICLES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            {/* Expense Type */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Receipt className="w-4 h-4 text-secondary" />
                Tipo de Despesa
              </label>
              <select
                value={expenseType}
                onChange={(e) => setExpenseType(e.target.value as ExpenseType)}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
              >
                <option value="">Selecione o tipo</option>
                {(Object.keys(EXPENSE_TYPE_LABELS) as ExpenseType[]).map((type) => (
                  <option key={type} value={type}>
                    {EXPENSE_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Receipt className="w-4 h-4 text-warning" />
                Valor da Despesa
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warning font-bold">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-warning focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Calendar className="w-4 h-4 text-secondary" />
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
              />
            </div>

            {/* Submit Button */}
            <NeonButton
              type="submit"
              variant="orange"
              size="lg"
              className="w-full"
            >
              Adicionar Despesa
            </NeonButton>
          </form>
        </NeonCard>
      </div>
    </div>
  );
};
