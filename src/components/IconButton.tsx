import React, { useState } from "react";
import { LucideIcon } from "lucide-react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  tooltip?: string;
  className?: string;
}

const variantStyles = {
  primary: "text-sky-300 hover:text-sky-200 hover:bg-sky-500/20 hover:border-sky-500/50",
  secondary: "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 hover:border-slate-500/50",
  danger: "text-red-400 hover:text-red-300 hover:bg-red-500/20 hover:border-red-500/50",
  ghost: "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30",
};

const sizeStyles = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export function IconButton({
  icon: Icon,
  variant = "secondary",
  size = "md",
  tooltip,
  className = "",
  ...props
}: IconButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        className={`
          inline-flex items-center justify-center rounded-lg border border-slate-700/50
          transition-all duration-300 ease-out
          hover:scale-110 hover:shadow-lg hover:shadow-sky-500/20
          active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${className}
        `}
        onMouseEnter={() => tooltip && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        title={tooltip}
        {...props}
      >
        <Icon className="w-5 h-5" />
      </button>

      {tooltip && showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900/95 border border-slate-700/50 rounded-lg text-xs font-medium text-slate-200 whitespace-nowrap pointer-events-none animate-fade-in-up z-50">
          {tooltip}
        </div>
      )}
    </div>
  );
}

interface ActionRowProps {
  children: React.ReactNode;
  className?: string;
}

export function ActionRow({ children, className = "" }: ActionRowProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {children}
    </div>
  );
}

interface ConfirmButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function ConfirmButton({
  label,
  confirmLabel = "Confirmer",
  danger = false,
  loading = false,
  onConfirm,
  children,
  className = "",
  ...props
}: ConfirmButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConfirming) {
      onConfirm?.();
      setIsConfirming(false);
    } else {
      setIsConfirming(true);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`
        px-3 py-2 rounded-lg text-sm font-medium
        transition-all duration-300 ease-out
        flex items-center gap-2
        ${
          isConfirming
            ? danger
              ? "bg-red-500/80 hover:bg-red-600 text-white border border-red-600"
              : "bg-orange-500/80 hover:bg-orange-600 text-white border border-orange-600"
            : danger
              ? "bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 hover:border-red-500/50"
              : "bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 hover:border-sky-500/50"
        }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
      {loading ? "..." : isConfirming ? confirmLabel : label}
    </button>
  );
}
