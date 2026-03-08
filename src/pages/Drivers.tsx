import { useStore } from '@/store/useStore';
import { NeonCard } from '@/components/NeonCard';
import { VehicleIcon } from '@/components/VehicleIcon';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { User, TrendingUp, TrendingDown } from 'lucide-react';

export const Drivers = () => {
  const { drivers, getDriverRevenues, getDriverExpenses } = useStore();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl lg:text-4xl font-orbitron font-bold text-primary neon-text-cyan">
        Motoristas
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((driver, index) => {
          const revenues = getDriverRevenues(driver.id);
          const expenses = getDriverExpenses(driver.id);
          const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
          const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

          return (
            <NeonCard
              key={driver.id}
              variant={index === 0 ? 'cyan' : index === 1 ? 'purple' : 'green'}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="absolute -bottom-2 -right-2">
                    <VehicleIcon vehicle={driver.vehicle} className="w-10 h-10" />
                  </div>
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-xl font-orbitron font-bold text-foreground">
                    {driver.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">{driver.vehicle}</p>
                </div>

                {/* Stats */}
                <div className="w-full pt-4 border-t border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-accent" />
                      <span className="text-sm text-muted-foreground">Receitas</span>
                    </div>
                    <span className="font-orbitron font-semibold text-accent">
                      <AnimatedCounter value={totalRevenue} prefix="MZN " decimals={2} />
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-warning" />
                      <span className="text-sm text-muted-foreground">Despesas</span>
                    </div>
                    <span className="font-orbitron font-semibold text-warning">
                      <AnimatedCounter value={totalExpenses} prefix="MZN " decimals={2} />
                    </span>
                  </div>
                </div>

                {/* History Count */}
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>{revenues.length} registros de receita</span>
                </div>
              </div>
            </NeonCard>
          );
        })}
      </div>
    </div>
  );
};
