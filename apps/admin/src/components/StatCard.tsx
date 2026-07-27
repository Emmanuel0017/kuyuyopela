import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  label: string;
  value: string | number;
  delta?: string;
  trend?: 'up' | 'down';
  icon: ReactNode;
}

export function StatCard({ label, value, delta, trend, icon }: Props) {
  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-2">
        <span className="label">{label}</span>
        <span className="icon-wrap">{icon}</span>
      </div>
      <div className="value">{value}</div>
      {delta && (
        <div className={`delta ${trend === 'down' ? 'down' : ''}`}>
          {trend === 'down' ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
          {delta}
        </div>
      )}
    </div>
  );
}