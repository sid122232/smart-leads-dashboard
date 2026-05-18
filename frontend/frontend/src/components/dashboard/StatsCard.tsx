import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: number;
    label: string;
  };
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  iconColor = 'text-brand-600',
  iconBg = 'bg-brand-50 dark:bg-brand-900/20',
  trend,
}: StatsCardProps) => {
  const trendPositive = trend && trend.value > 0;
  const trendNeutral = trend && trend.value === 0;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 dark:border-white/10 dark:bg-zinc-900-2">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
        <div className={cn('rounded-lg p-2.5', iconBg)}>
          <Icon className={cn('size-5', iconColor)} />
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          {trendNeutral ? (
            <Minus className="size-3.5 text-gray-400" />
          ) : trendPositive ? (
            <TrendingUp className="size-3.5 text-green-500" />
          ) : (
            <TrendingDown className="size-3.5 text-red-500" />
          )}
          <span
            className={cn(
              'text-xs font-medium',
              trendNeutral
                ? 'text-gray-400'
                : trendPositive
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            )}
          >
            {trend.value > 0 ? '+' : ''}
            {trend.value}%
          </span>
          <span className="text-xs text-gray-400">{trend.label}</span>
        </div>
      )}
    </div>
  );
};