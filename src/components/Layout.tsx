import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Receipt, 
  Wallet, 
  History,
  Truck,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/motoristas', label: 'Motoristas', icon: Users },
  { path: '/receitas', label: 'Receitas', icon: DollarSign },
  { path: '/despesas', label: 'Despesas', icon: Receipt },
  { path: '/salarios', label: 'Salários', icon: Wallet },
  { path: '/historico', label: 'Histórico', icon: History },
];

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-4 py-3 lg:px-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Truck className="w-8 h-8 text-primary animate-float" />
              <div className="absolute inset-0 blur-lg bg-primary/30" />
            </div>
            <span className="text-xl font-orbitron font-bold text-primary neon-text-cyan">
              BSM Transport
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300",
                    isActive
                      ? "bg-primary/20 text-primary neon-border-cyan border"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-300 ml-2"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-foreground"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-border bg-card/95 backdrop-blur-md animate-fade-in-up">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-4 border-b border-border/50 transition-all duration-300",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-20 min-h-screen">
        <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
};
