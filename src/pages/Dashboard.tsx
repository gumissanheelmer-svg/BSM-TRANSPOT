import { useStore } from '@/store/useStore';
import { NeonCard } from '@/components/NeonCard';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useMemo } from 'react';

const COLORS = ['#00FFFF', '#9B30FF', '#39FF14', '#FFA500'];

export const Dashboard = () => {
  const { 
    revenues, 
    expenses, 
    salaries,
    getTotalRevenue, 
    getTotalExpenses, 
    getTotalSalaries,
    getNetProfit 
  } = useStore();

  const dailyRevenue = getTotalRevenue('daily');
  const weeklyRevenue = getTotalRevenue('weekly');
  const monthlyRevenue = getTotalRevenue('monthly');
  const monthlyExpenses = getTotalExpenses('monthly');
  const monthlySalaries = getTotalSalaries('monthly');
  const netProfit = getNetProfit('monthly');
  const isNegative = netProfit < 0;

  // Prepare chart data
  const barChartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map((date) => {
      const dayRevenue = revenues
        .filter((r) => r.date === date)
        .reduce((sum, r) => sum + r.amount, 0);
      const dayExpense = expenses
        .filter((e) => e.date === date)
        .reduce((sum, e) => sum + e.amount, 0);

      return {
        date: new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' }),
        receita: dayRevenue,
        despesa: dayExpense,
      };
    });
  }, [revenues, expenses]);

  const lineChartData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return {
        month: date.getMonth(),
        year: date.getFullYear(),
        label: date.toLocaleDateString('pt-BR', { month: 'short' }),
      };
    });

    return last6Months.map(({ month, year, label }) => {
      const monthRevenue = revenues
        .filter((r) => {
          const d = new Date(r.date);
          return d.getMonth() === month && d.getFullYear() === year;
        })
        .reduce((sum, r) => sum + r.amount, 0);

      return { name: label, receita: monthRevenue };
    });
  }, [revenues]);

  const pieChartData = useMemo(() => [
    { name: 'Receitas', value: monthlyRevenue },
    { name: 'Despesas', value: monthlyExpenses },
    { name: 'Salários', value: monthlySalaries },
  ], [monthlyRevenue, monthlyExpenses, monthlySalaries]);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl lg:text-4xl font-orbitron font-bold text-primary neon-text-cyan">
          Dashboard
        </h1>
        {isNegative && (
          <div className="flex items-center gap-2 px-4 py-2 bg-destructive/20 border border-destructive rounded-lg animate-pulse">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <span className="text-destructive font-semibold neon-text-red">Saldo Negativo!</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <NeonCard variant="cyan" className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Receita Diária</p>
              <h3 className="text-2xl font-orbitron font-bold text-primary">
                <AnimatedCounter value={dailyRevenue} prefix="$" decimals={2} />
              </h3>
            </div>
            <DollarSign className="w-8 h-8 text-primary" />
          </div>
        </NeonCard>

        <NeonCard variant="cyan" className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Receita Semanal</p>
              <h3 className="text-2xl font-orbitron font-bold text-primary">
                <AnimatedCounter value={weeklyRevenue} prefix="$" decimals={2} />
              </h3>
            </div>
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
        </NeonCard>

        <NeonCard variant="green" className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Receita Mensal</p>
              <h3 className="text-2xl font-orbitron font-bold text-accent">
                <AnimatedCounter value={monthlyRevenue} prefix="$" decimals={2} />
              </h3>
            </div>
            <TrendingUp className="w-8 h-8 text-accent" />
          </div>
        </NeonCard>

        <NeonCard 
          variant={isNegative ? 'orange' : 'purple'} 
          className="animate-fade-in-up" 
          style={{ animationDelay: '300ms' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Lucro Líquido</p>
              <h3 className={`text-2xl font-orbitron font-bold ${isNegative ? 'text-destructive' : 'text-secondary'}`}>
                <AnimatedCounter value={netProfit} prefix="$" decimals={2} />
              </h3>
            </div>
            {isNegative ? (
              <TrendingDown className="w-8 h-8 text-destructive" />
            ) : (
              <Wallet className="w-8 h-8 text-secondary" />
            )}
          </div>
        </NeonCard>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NeonCard variant="orange" className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Despesas Mensais</p>
              <h3 className="text-2xl font-orbitron font-bold text-warning">
                <AnimatedCounter value={monthlyExpenses} prefix="$" decimals={2} />
              </h3>
            </div>
            <TrendingDown className="w-8 h-8 text-warning" />
          </div>
        </NeonCard>

        <NeonCard variant="purple" className="animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Salários Pagos</p>
              <h3 className="text-2xl font-orbitron font-bold text-secondary">
                <AnimatedCounter value={monthlySalaries} prefix="$" decimals={2} />
              </h3>
            </div>
            <Wallet className="w-8 h-8 text-secondary" />
          </div>
        </NeonCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Daily/Weekly */}
        <NeonCard variant="cyan" hover={false} className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <h3 className="text-lg font-orbitron font-semibold text-primary mb-4">
            Receitas vs Despesas (Últimos 7 dias)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #00FFFF',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="receita" fill="#00FFFF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="despesa" fill="#FFA500" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </NeonCard>

        {/* Line Chart - Monthly Evolution */}
        <NeonCard variant="green" hover={false} className="animate-fade-in-up" style={{ animationDelay: '700ms' }}>
          <h3 className="text-lg font-orbitron font-semibold text-accent mb-4">
            Evolução Mensal de Receitas
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #39FF14',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="receita"
                  stroke="#39FF14"
                  strokeWidth={3}
                  dot={{ fill: '#39FF14', strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: '#39FF14' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </NeonCard>
      </div>

      {/* Pie Chart */}
      <NeonCard variant="purple" hover={false} className="animate-fade-in-up" style={{ animationDelay: '800ms' }}>
        <h3 className="text-lg font-orbitron font-semibold text-secondary mb-4">
          Distribuição Mensal
        </h3>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #9B30FF',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </NeonCard>
    </div>
  );
};
