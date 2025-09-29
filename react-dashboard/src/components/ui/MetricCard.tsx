import React from 'react';
import { clsx } from 'clsx';
import { formatters } from '../../utils/formatters';

interface MetricCardProps {
  title: string;
  value: string | number;
  format?: 'currency' | 'number' | 'days' | 'percentage';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
  };
  icon?: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  loading?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  format = 'number',
  trend,
  icon,
  color = 'blue',
  loading = false
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return formatters.currency(val);
      case 'number':
        return formatters.number(val);
      case 'days':
        return formatters.days(val);
      case 'percentage':
        return formatters.percentage(val);
      default:
        return val.toString();
    }
  };

  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50',
    green: 'border-green-200 bg-green-50',
    red: 'border-red-200 bg-red-50',
    yellow: 'border-yellow-200 bg-yellow-50',
    purple: 'border-purple-200 bg-purple-50'
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600'
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    const trendClasses = clsx('text-sm font-medium', {
      'text-green-600': trend.direction === 'up',
      'text-red-600': trend.direction === 'down',
      'text-gray-600': trend.direction === 'stable'
    });
    
    const arrows = {
      up: '↗',
      down: '↘',
      stable: '→'
    };
    
    return (
      <span className={trendClasses}>
        {arrows[trend.direction]} {Math.abs(trend.value)}%
      </span>
    );
  };

  return (
    <div className={clsx(
      'rounded-lg border-2 p-6 transition-all hover:shadow-md',
      colorClasses[color]
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {loading ? (
            <div className="mt-2">
              <div className="animate-pulse bg-gray-300 h-8 w-24 rounded"></div>
            </div>
          ) : (
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {formatValue(value)}
            </p>
          )}
          {trend && !loading && (
            <div className="mt-2">
              {getTrendIcon()}
            </div>
          )}
        </div>
        {icon && (
          <div className={clsx('text-3xl', iconColorClasses[color])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};