import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  change?: number;
  changeLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendPositive?: boolean;
  variant?: 'default' | 'warning' | 'danger' | 'success' | 'info';
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export default function MetricCard({
  label,
  value,
  subValue,
  change,
  changeLabel,
  trend = 'neutral',
  trendPositive = true,
  variant = 'default',
  icon,
  className = '',
  children,
}: MetricCardProps) {
  const variantStyles = {
    default: 'bg-surface border-border',
    warning: 'bg-warning/5 border-warning/25 glow-danger',
    danger: 'bg-danger/5 border-danger/25 glow-danger',
    success: 'bg-success/5 border-success/25',
    info: 'bg-primary/5 border-primary/25',
  };

  const trendColor =
    trend === 'neutral'
      ? 'text-muted-foreground'
      : trendPositive
        ? trend === 'up'
          ? 'text-success'
          : 'text-danger'
        : trend === 'up'
          ? 'text-danger'
          : 'text-success';

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div
      className={`relative rounded-lg border p-4 shadow-card transition-all duration-200 hover:shadow-elevated ${variantStyles[variant]} ${className}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-[11px] font-500 uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        {icon && <div className="shrink-0 opacity-60">{icon}</div>}
      </div>
      <p className="text-2xl font-700 tabular-nums text-white leading-none mb-1">{value}</p>
      {subValue && (
        <p className="text-[12px] text-muted-foreground font-mono tabular-nums">{subValue}</p>
      )}
      {(change !== undefined || changeLabel) && (
        <div className={`flex items-center gap-1 mt-2 text-[11px] font-500 ${trendColor}`}>
          <TrendIcon size={12} />
          {change !== undefined && (
            <span className="tabular-nums">
              {change > 0 ? '+' : ''}
              {change}%
            </span>
          )}
          {changeLabel && <span className="text-muted-foreground">{changeLabel}</span>}
        </div>
      )}
      {children}
    </div>
  );
}
