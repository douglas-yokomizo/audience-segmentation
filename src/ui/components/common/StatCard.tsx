import React from 'react';
import { cn } from '../../utils/cn';

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
}

const variantStyles = {
  primary: 'bg-gradient-to-br from-primary-500 to-primary-600',
  secondary: 'bg-gradient-to-br from-secondary-500 to-secondary-600',
  success: 'bg-gradient-to-br from-success-500 to-success-600',
  warning: 'bg-gradient-to-br from-warning-500 to-warning-600',
  danger: 'bg-gradient-to-br from-danger-500 to-danger-600',
  info: 'bg-gradient-to-br from-blue-500 to-blue-600',
};

export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, title, value, icon, trend, variant = 'primary', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl shadow-md text-white overflow-hidden',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-80">{title}</p>
              <p className="text-3xl font-bold mt-1">{value}</p>
              
              {trend && (
                <div className="flex items-center mt-2">
                  {trend.isPositive ? (
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  )}
                  <span className="text-xs font-medium">
                    {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                  </span>
                </div>
              )}
            </div>
            
            {icon && (
              <div className="rounded-full bg-white/20 p-3">
                {icon}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';
