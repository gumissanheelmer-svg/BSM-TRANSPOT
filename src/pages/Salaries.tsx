import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { NeonCard } from '@/components/NeonCard';
import { NeonButton } from '@/components/NeonButton';
import { DRIVERS } from '@/types';
import { toast } from 'sonner';
import { Wallet, Calendar, User, DollarSign } from 'lucide-react';

export const Salaries = () => {
  const { addSalary, salaries } = useStore();
  const [selectedDriver, setSelectedDriver] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState(() => {
    const now = new Date();
    const day28 = new Date(now.getFullYear(), now.getMonth(), 28);
    return day28.toISOString().split('T')[0];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDriver || !amount || !paymentDate) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    const driver = DRIVERS.find((d) => d.id === selectedDriver);
    if (!driver) return;

    addSalary({
      driverId: driver.id,
      driverName: driver.name,
      amount: parseFloat(amount),
      paymentDate,
    });

    toast.success('Salário registrado com sucesso!', {
      style: {
        background: '#1a1a1a',
        border: '1px solid #00FFFF',
        color: '#fff',
      },
    });

    setSelectedDriver('');
    setAmount('');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl lg:text-4xl font-orbitron font-bold text-primary neon-text-cyan">
        Pagamento de Salários
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <NeonCard variant="cyan" hover={false} className="animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Driver Select */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <User className="w-4 h-4 text-primary" />
                Motorista
              </label>
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">Selecione um motorista</option>
                {DRIVERS.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <DollarSign className="w-4 h-4 text-accent" />
                Valor do Salário
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-accent font-bold">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Payment Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                Data de Pagamento
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
              <p className="text-xs text-muted-foreground">
                Pagamentos são geralmente realizados todo dia 28
              </p>
            </div>

            {/* Submit Button */}
            <NeonButton
              type="submit"
              variant="cyan"
              size="lg"
              className="w-full animate-fade-in-up"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Registrar Salário
            </NeonButton>
          </form>
        </NeonCard>

        {/* Salary Table */}
        <NeonCard variant="purple" hover={false} className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <h3 className="text-lg font-orbitron font-semibold text-secondary mb-4">
            Histórico de Salários
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 text-muted-foreground text-sm font-medium">
                    Motorista
                  </th>
                  <th className="text-left py-3 px-2 text-muted-foreground text-sm font-medium">
                    Salário
                  </th>
                  <th className="text-left py-3 px-2 text-muted-foreground text-sm font-medium">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody>
                {salaries.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-muted-foreground">
                      Nenhum salário registrado
                    </td>
                  </tr>
                ) : (
                  salaries
                    .slice()
                    .reverse()
                    .slice(0, 10)
                    .map((salary, index) => (
                      <tr
                        key={salary.id}
                        className={`border-b border-border/50 ${
                          index % 2 === 0 ? 'table-row-dark' : 'table-row-darker'
                        } animate-fade-in-up`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <td className="py-3 px-2 font-medium">{salary.driverName}</td>
                        <td className="py-3 px-2 text-accent font-orbitron">
                          MZN {salary.amount.toFixed(2)}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">
                          {new Date(salary.paymentDate).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </NeonCard>
      </div>
    </div>
  );
};
