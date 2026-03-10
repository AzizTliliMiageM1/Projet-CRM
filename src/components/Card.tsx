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
    default: "bg-gradient-to-br from-slate-900/50 via-slate-900/30 to-slate-950 border border-slate-800/50 hover:border-slate-700/50",
    elevated: "bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-950/60 border border-sky-500/20 shadow-lg shadow-sky-500/10 hover:shadow-xl hover:shadow-sky-500/20",
    outlined: "bg-slate-900/20 border-2 border-slate-800 hover:border-slate-700",
  };

  return (
    <div
      className={`
        rounded-2xl backdrop-blur-sm
        transition-all duration-300 ease-out
        ${variantStyles[variant]}
        ${hoverable ? "hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-1 cursor-pointer" : ""}
        ${className}
      `}
      {...props}
    >
      {/* Glow overlay on hover */}
      {hoverable && (
        <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
      )}

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
    <Card variant="elevated" hoverable className="relative overflow-hidden group h-full">
      {/* Background glow animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{title}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <p className="text-4xl font-bold bg-gradient-to-r from-slate-50 to-slate-200 bg-clip-text text-transparent">
                {value}
              </p>
            </div>
            {description && <p className="text-xs text-slate-500 mt-2">{description}</p>}
          </div>
          {icon && (
            <div className="text-4xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 transform flex-shrink-0 ml-4">
              {icon}
            </div>
          )}
        </div>

        {trend && (
          <div
            className={`flex items-center gap-2 text-sm font-semibold ${trend.isPositive ? "text-emerald-300" : "text-red-300"}`}
          >
            <span className="text-lg">{trend.isPositive ? "↑" : "↓"}</span>
            <span>{Math.abs(trend.value)}% vs dernier mois</span>
          </div>
        )}

        {/* Animated border on hover */}
        <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-sky-400/0 via-sky-400/20 to-sky-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:animate-pulse"></div>
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
