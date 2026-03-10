import React from "react";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "primary"
  | "secondary";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-600/30 border-slate-500/50 text-slate-200",
  success: "bg-green-600/30 border-green-500/50 text-green-200",
  warning: "bg-orange-600/30 border-orange-500/50 text-orange-200",
  danger: "bg-red-600/30 border-red-500/50 text-red-200",
  info: "bg-blue-600/30 border-blue-500/50 text-blue-200",
  primary: "bg-sky-600/30 border-sky-500/50 text-sky-200",
  secondary: "bg-purple-600/30 border-purple-500/50 text-purple-200",
};

export function Badge({
  variant = "default",
  icon,
  children,
  className = "",
  ...props
}: BadgeProps) {
  return (
    <div
      className={`
        inline-flex items-center gap-2
        rounded-lg px-3 py-1.5 text-xs font-semibold
        border backdrop-blur-sm
        transition-all duration-300
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<
  string,
  { variant: BadgeVariant; label: string; icon?: string }
> = {
  new: { variant: "default", label: "New", icon: "🆕" },
  qualified: { variant: "info", label: "Qualified", icon: "✅" },
  proposal: { variant: "primary", label: "Proposal", icon: "📋" },
  negotiation: { variant: "warning", label: "Negotiation", icon: "🤝" },
  won: { variant: "success", label: "Won", icon: "🎉" },
  lost: { variant: "danger", label: "Lost", icon: "❌" },
  pending: { variant: "warning", label: "Pending", icon: "⏳" },
  completed: { variant: "success", label: "Completed", icon: "✓" },
  active: { variant: "success", label: "Active", icon: "🔵" },
  inactive: { variant: "default", label: "Inactive", icon: "⚪" },
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    variant: "default" as BadgeVariant,
    label: status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase() || "Unknown",
    icon: "•",
  };

  return (
    <Badge variant={config.variant} className={className}>
      {config.icon && <span>{config.icon}</span>}
      {config.label}
    </Badge>
  );
}
