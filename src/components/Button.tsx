import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "outline" | "ghost";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40",
  secondary:
    "bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-50 shadow-lg shadow-slate-500/10 hover:shadow-slate-500/20",
  danger:
    "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40",
  success:
    "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40",
  outline:
    "border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-slate-100 hover:bg-slate-800/30 backdrop-blur-sm",
  ghost: "text-slate-400 hover:text-slate-300 hover:bg-slate-800/20 backdrop-blur-sm",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-2 py-1 text-xs font-semibold rounded-md",
  sm: "px-3 py-1.5 text-xs font-semibold rounded-lg",
  md: "px-4 py-2 text-sm font-semibold rounded-lg",
  lg: "px-6 py-3 text-base font-semibold rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  isLoading = false,
  fullWidth = false,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        transition-all duration-300
        hover:scale-105 active:scale-95
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
        ${fullWidth ? "w-full" : ""}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {icon && !isLoading && <span className="flex-shrink-0">{icon}</span>}
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4 flex-shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
