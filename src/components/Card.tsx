import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  hoverable?: boolean;
  variant?: "default" | "elevated" | "outlined";
  className?: string;
}

export function Card({
  title,
  description,
  header,
  footer,
  hoverable = false,
  variant = "default",
  children,
  className = "",
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-gradient-to-br from-slate-900/50 via-slate-900/30 to-slate-950 border border-slate-800/50",
    elevated: "bg-slate-900/70 border border-slate-700 shadow-2xl",
    outlined: "bg-slate-900/20 border-2 border-slate-800",
  };

  return (
    <div
      className={`
        rounded-2xl backdrop-blur-sm
        transition-all duration-300
        ${variantStyles[variant]}
        ${hoverable ? "hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-1 cursor-pointer" : ""}
        ${className}
      `}
      {...props}
    >
      {header && <div className="border-b border-slate-800/50">{header}</div>}

      {(title || description) && (
        <div className="px-6 pt-6 pb-4">
          {title && <h3 className="text-lg font-semibold text-slate-50">{title}</h3>}
          {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
        </div>
      )}

      <div className={`${title || description ? "" : "p-6"} ${!footer ? "pb-6" : ""}`}>
        {children && (
          <div className={`${title || description ? "px-6" : ""}`}>
            {children}
          </div>
        )}
      </div>

      {footer && (
        <div className="border-t border-slate-800/50 px-6 py-4">
          {footer}
        </div>
      )}
    </div>
  );
}

interface StatsCardProps {
  icon?: React.ReactNode;
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export function StatsCard({ icon, title, value, trend, description }: StatsCardProps) {
  return (
    <Card variant="elevated" hoverable>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">{title}</p>
            <p className="text-4xl font-bold text-slate-50 mt-2">{value}</p>
            {description && <p className="text-xs text-slate-500 mt-2">{description}</p>}
          </div>
          {icon && <div className="text-4xl opacity-50">{icon}</div>}
        </div>

        {trend && (
          <div className={`flex items-center gap-2 text-sm font-semibold ${trend.isPositive ? "text-green-400" : "text-red-400"}`}>
            <span>{trend.isPositive ? "↑" : "↓"}</span>
            <span>{Math.abs(trend.value)}% vs dernier mois</span>
          </div>
        )}
      </div>
    </Card>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card variant="outlined" className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {icon && <div className="text-5xl opacity-40 mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
      {description && <p className="text-sm text-slate-500 mb-6 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </Card>
  );
}
