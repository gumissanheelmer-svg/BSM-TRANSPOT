import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { NeonCard } from '@/components/NeonCard';
import { NeonButton } from '@/components/NeonButton';
import { DRIVERS } from '@/types';
import { toast } from 'sonner';
import { DollarSign, Calendar, User, Truck } from 'lucide-react';

export const Revenues = () => {
  const { addRevenue } = useStore();
  const [selectedDriver, setSelectedDriver] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const selectedDriverData = DRIVERS.find((d) => d.id === selectedDriver);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDriver || !amount || !date) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    const driver = DRIVERS.find((d) => d.id === selectedDriver);
    if (!driver) return;

    addRevenue({
      driverId: driver.id,
      driverName: driver.name,
      vehicle: driver.vehicle,
      amount: parseFloat(amount),
      date,
    });

    toast.success('Receita adicionada com sucesso!', {
      style: {
        background: '#1a1a1a',
        border: '1px solid #39FF14',
        color: '#fff',
      },
    });

    setSelectedDriver('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl lg:text-4xl font-orbitron font-bold text-primary neon-text-cyan">
        Registro de Receitas
      </h1>

      <div className="max-w-xl mx-auto">
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

            {/* Vehicle (Auto-filled) */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Truck className="w-4 h-4 text-primary" />
                Veículo
              </label>
              <input
                type="text"
                value={selectedDriverData?.vehicle || ''}
                readOnly
                placeholder="Selecione um motorista"
                className="w-full px-4 py-3 bg-muted border border-border rounded-lg text-muted-foreground cursor-not-allowed"
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <DollarSign className="w-4 h-4 text-accent" />
                Valor da Receita
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

            {/* Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Submit Button */}
            <NeonButton
              type="submit"
              variant="green"
              size="lg"
              pulse
              className="w-full"
            >
              Adicionar Receita
            </NeonButton>
          </form>
        </NeonCard>
      </div>
    </div>
  );
};
