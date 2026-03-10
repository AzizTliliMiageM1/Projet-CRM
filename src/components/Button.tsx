import React, { useState } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "success" | "outline" | "ghost";
type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  /** Afficher ripple effect au clic */
  enableRipple?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 border border-sky-500/30",
  secondary:
    "bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-50 shadow-lg shadow-slate-500/10 hover:shadow-slate-500/30 border border-slate-600/50",
  danger:
    "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-rose-600 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 border border-red-500/30",
  success:
    "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 border border-emerald-500/30",
  outline:
    "border-2 border-slate-600 hover:border-sky-500 text-slate-300 hover:text-sky-200 hover:bg-slate-800/40 backdrop-blur-sm transition-all duration-300",
  ghost: "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 backdrop-blur-sm border border-transparent hover:border-slate-700/50",
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
  enableRipple = true,
  onClick,
  ...props
}: ButtonProps) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const nextIdRef = React.useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (enableRipple && !disabled && !isLoading) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = nextIdRef.current++;

      setRipples((prev) => [...prev, { x, y, id }]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);
    }

    onClick?.(e);
  };

  return (
    <button
      className={`
        relative inline-flex items-center justify-center gap-2
        transition-all duration-200 ease-out
        hover:scale-105 active:scale-95
        disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
        rounded-lg overflow-hidden group
        ${fullWidth ? "w-full" : ""}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      style={{
        willChange: "transform, box-shadow, background",
        transform: "translateZ(0)",
      }}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {/* GPU-accelerated ripple effects */}
      {enableRipple &&
        ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="absolute rounded-full bg-white/20 pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 10,
              height: 10,
              transform: "translate(-50%, -50%)",
              animation: "buttonRipple 600ms ease-out",
            }}
          />
        ))}

      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center gap-2">
        {icon && !isLoading && (
          <span className="flex-shrink-0 transition-all duration-200 group-hover:scale-110 group-active:scale-95">
            {icon}
          </span>
        )}
        {isLoading && (
          <svg
            className="animate-spinMedium h-4 w-4 flex-shrink-0"
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
      </div>
    </button>
  );
}
