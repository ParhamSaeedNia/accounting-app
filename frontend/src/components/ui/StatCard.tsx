import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  variant?: 'default' | 'income' | 'expense';
}

export default function StatCard({ label, value, icon, trend, variant = 'default' }: StatCardProps) {
  const getValueColor = () => {
    if (variant === 'income') return 'text-emerald-400';
    if (variant === 'expense') return 'text-rose-400';
    return 'text-white';
  };

  const getGradient = () => {
    if (variant === 'income') return 'from-emerald-500/10 to-transparent';
    if (variant === 'expense') return 'from-rose-500/10 to-transparent';
    return 'from-indigo-500/10 to-transparent';
  };

  return (
    <div className={`relative overflow-hidden bg-dark-900 border border-dark-700 rounded-xl p-5 bg-gradient-to-br ${getGradient()}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-dark-400 uppercase tracking-wider mb-2">
            {label}
          </p>
          <p className={`text-2xl font-bold font-mono ${getValueColor()}`}>
            {value}
          </p>
        </div>
        {icon && (
          <div className="p-2 bg-dark-800 rounded-lg">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1">
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          ) : trend === 'down' ? (
            <TrendingDown className="w-4 h-4 text-rose-400" />
          ) : null}
          <span className={`text-xs ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-dark-400'}`}>
            vs last period
          </span>
        </div>
      )}
    </div>
  );
}

