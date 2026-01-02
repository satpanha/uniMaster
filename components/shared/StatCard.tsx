/**
 * StatCard Component
 * Reusable card for displaying statistics
 */

import { memo } from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui';

type StatCardVariant = 'default' | 'kpi';
type StatCardColor =
  | 'blue'
  | 'green'
  | 'purple'
  | 'orange'
  | 'red'
  | 'yellow'
  | 'gold';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: StatCardColor;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  href?: string;
  subtitle?: string;
  description?: string;
  className?: string;
  variant?: StatCardVariant;
}



export const StatCard = memo<StatCardProps>(
  ({
    title,
    value,
    icon: Icon,
    color = 'blue',
    trend,
    href,
    subtitle,
    description,
    className = '',
    variant = 'default',
  }) => {
    const formattedValue =
      typeof value === 'number' ? value.toLocaleString() : value;
    const trendLabel = trend?.label ?? 'vs last month';


    /**
     * KPI VARIANT (matches screenshot)
     */
    if (variant === 'kpi') {
      const content = (
        <Card
          className={`p-6 bg-white hover:shadow-lg transition-all stat-card kpi stat-card--${color} ${className}`}
        >
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-3">
                {title}
              </p>
              <p className="text-4xl font-bold text-foreground mb-3 stat-value">
                {formattedValue}
              </p>

              {trend && (
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-sm font-semibold ${trend.isPositive ? 'trend-positive' : 'trend-negative'}`}
                  >
                    {trend.isPositive ? '↑' : '↓'}{' '}
                    {Math.abs(trend.value)}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {trendLabel}
                  </span>
                </div>
              )}
            </div>

            {Icon && (
              <div
                className="
                  w-14 h-14
                  rounded-2xl
                  flex items-center justify-center
                  shadow-md
                  transition-transform duration-200
                  hover:scale-105
                  stat-icon
                "
              >
                <Icon
                  className="w-7 h-7 text-white stat-icon-svg"
                  strokeWidth={2.2}
                />
              </div>
            )}
          </div>
        </Card>
      );

      return href ? (
        <Link href={href} className="block focus-visible:outline-none">
          {content}
        </Link>
      ) : (
        content
      );
    }

    /**
     * DEFAULT VARIANT
     */
    const content = (
      <Card className={`hover:shadow-md transition-shadow stat-card stat-card--${color} ${className}`}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-lg stat-icon-bg"
            >
              <Icon
                className="w-6 h-6 stat-icon-svg"
                strokeWidth={2}
              />
            </div>

            <div className="flex-1">
              <div className="text-sm text-muted-foreground">{title}</div>
              <div
                className="text-2xl font-bold mt-1 stat-value"
              >
                {formattedValue}
              </div>

              {subtitle && (
                <div className="text-xs text-muted-foreground mt-1">
                  {subtitle}
                </div>
              )}

              {description && (
                <div className="text-xs text-muted-foreground mt-1">
                  {description}
                </div>
              )}

              {trend && (
                <div className={`text-xs mt-1 font-medium ${trend.isPositive ? 'trend-positive' : 'trend-negative'}`}>
                  {trend.isPositive ? '↑' : '↓'}{' '}
                  {Math.abs(trend.value)}%
                  {trend.label && (
                    <span className="text-muted-foreground">
                      {' '}
                      {trend.label}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );

    return href ? (
      <Link href={href} className="block">
        {content}
      </Link>
    ) : (
      content
    );
  }
);

StatCard.displayName = 'StatCard';