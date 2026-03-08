import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { NeonCard } from '@/components/NeonCard';
import { NeonButton } from '@/components/NeonButton';
import { DRIVERS, VEHICLES, EXPENSE_TYPE_LABELS } from '@/types';
import { Download, Filter, DollarSign, Receipt, Wallet } from 'lucide-react';

type RecordType = 'all' | 'revenue' | 'expense' | 'salary';

interface HistoryRecord {
  id: string;
  type: 'revenue' | 'expense' | 'salary';
  description: string;
  amount: number;
  date: string;
  category?: string;
}

export const History = () => {
  const { revenues, expenses, salaries } = useStore();
  const [filterDriver, setFilterDriver] = useState('');
  const [filterVehicle, setFilterVehicle] = useState('');
  const [filterType, setFilterType] = useState<RecordType>('all');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);

  const allRecords = useMemo(() => {
    const records: HistoryRecord[] = [];

    revenues.forEach((r) => {
      records.push({
        id: r.id,
        type: 'revenue',
        description: `Receita - ${r.driverName} (${r.vehicle})`,
        amount: r.amount,
        date: r.date,
        category: r.driverName,
      });
    });

    expenses.forEach((e) => {
      records.push({
        id: e.id,
        type: 'expense',
        description: `${EXPENSE_TYPE_LABELS[e.type]} - ${e.vehicle}`,
        amount: -e.amount,
        date: e.date,
        category: e.vehicle,
      });
    });

    salaries.forEach((s) => {
      records.push({
        id: s.id,
        type: 'salary',
        description: `Salário - ${s.driverName}`,
        amount: -s.amount,
        date: s.paymentDate,
        category: s.driverName,
      });
    });

    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [revenues, expenses, salaries]);

  const filteredRecords = useMemo(() => {
    return allRecords.filter((record) => {
      if (filterType !== 'all' && record.type !== filterType) return false;
      if (filterDriver && !record.category?.includes(filterDriver)) return false;
      if (filterVehicle && !record.description.includes(filterVehicle)) return false;
      if (filterStartDate && record.date < filterStartDate) return false;
      if (filterEndDate && record.date > filterEndDate) return false;
      return true;
    });
  }, [allRecords, filterType, filterDriver, filterVehicle, filterStartDate, filterEndDate]);

  const visibleRecords = filteredRecords.slice(0, visibleCount);

  const handleExport = () => {
    const csvContent = [
      ['Tipo', 'Descrição', 'Valor', 'Data'].join(','),
      ...filteredRecords.map((r) =>
        [
          r.type === 'revenue' ? 'Receita' : r.type === 'expense' ? 'Despesa' : 'Salário',
          `"${r.description}"`,
          r.amount.toFixed(2),
          r.date,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bsm-transport-historico-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getTypeIcon = (type: HistoryRecord['type']) => {
    switch (type) {
      case 'revenue':
        return <DollarSign className="w-4 h-4 text-accent" />;
      case 'expense':
        return <Receipt className="w-4 h-4 text-warning" />;
      case 'salary':
        return <Wallet className="w-4 h-4 text-secondary" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-3xl lg:text-4xl font-orbitron font-bold text-primary neon-text-cyan">
          Histórico
        </h1>
        <NeonButton variant="cyan" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Exportar CSV
        </NeonButton>
      </div>

      {/* Filters */}
      <NeonCard variant="purple" hover={false} className="animate-fade-in-up">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-secondary" />
          <h3 className="font-orbitron font-semibold text-secondary">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Type Filter */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Tipo</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as RecordType)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="all">Todos</option>
              <option value="revenue">Receitas</option>
              <option value="expense">Despesas</option>
              <option value="salary">Salários</option>
            </select>
          </div>

          {/* Driver Filter */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Motorista</label>
            <select
              value={filterDriver}
              onChange={(e) => setFilterDriver(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="">Todos</option>
              {DRIVERS.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Filter */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Veículo</label>
            <select
              value={filterVehicle}
              onChange={(e) => setFilterVehicle(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="">Todos</option>
              {VEHICLES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Data Início</label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>

          {/* End Date */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Data Fim</label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
            />
          </div>
        </div>
      </NeonCard>

      {/* Records Table */}
      <NeonCard variant="cyan" hover={false} className="animate-fade-in-up overflow-hidden">
        <div className="overflow-x-auto scrollbar-futuristic">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">
                  Tipo
                </th>
                <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">
                  Descrição
                </th>
                <th className="text-right py-3 px-4 text-muted-foreground text-sm font-medium">
                  Valor
                </th>
                <th className="text-right py-3 px-4 text-muted-foreground text-sm font-medium">
                  Data
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleRecords.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted-foreground">
                    Nenhum registro encontrado
                  </td>
                </tr>
              ) : (
                visibleRecords.map((record, index) => (
                  <tr
                    key={record.id}
                    className={`border-b border-border/50 ${
                      index % 2 === 0 ? 'table-row-dark' : 'table-row-darker'
                    } animate-fade-in-up hover:bg-muted/50 transition-colors`}
                    style={{ animationDelay: `${Math.min(index * 30, 500)}ms` }}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(record.type)}
                        <span className="text-sm capitalize">
                          {record.type === 'revenue'
                            ? 'Receita'
                            : record.type === 'expense'
                            ? 'Despesa'
                            : 'Salário'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-foreground">{record.description}</td>
                    <td
                      className={`py-3 px-4 text-right font-orbitron font-semibold ${
                        record.amount >= 0 ? 'text-accent' : 'text-warning'
                      }`}
                    >
                      MZN {Math.abs(record.amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-muted-foreground">
                      {new Date(record.date).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Load More */}
        {visibleCount < filteredRecords.length && (
          <div className="pt-4 text-center border-t border-border">
            <NeonButton
              variant="purple"
              size="sm"
              onClick={() => setVisibleCount((prev) => prev + 20)}
            >
              Carregar mais ({filteredRecords.length - visibleCount} restantes)
            </NeonButton>
          </div>
        )}
      </NeonCard>
    </div>
  );
};
