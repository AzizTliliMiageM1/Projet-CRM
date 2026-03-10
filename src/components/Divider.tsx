import React from "react";
import { LucideIcon } from "lucide-react";

interface DividerProps {
  variant?: "solid" | "dashed" | "dotted" | "gradient";
  label?: string | React.ReactNode;
  icon?: LucideIcon;
  orientation?: "horizontal" | "vertical";
  spacing?: "sm" | "md" | "lg";
  className?: string;
}

const spacings = {
  sm: "my-3",
  md: "my-6",
  lg: "my-8",
};

const variants = {
  solid: "border-slate-700/50",
  dashed: "border-dashed border-slate-700/50",
  dotted: "border-dotted border-slate-700/50",
  gradient: "bg-gradient-to-r from-transparent via-slate-700/50 to-transparent border-0 h-px",
};

export function Divider({
  variant = "solid",
  label,
  icon: Icon,
  orientation = "horizontal",
  spacing = "md",
  className = "",
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div className={`inline-block h-full w-px bg-slate-700/50 ${className}`} />
    );
  }

  // Horizontal divider with optional label
  if (label) {
    return (
      <div className={`flex items-center gap-4 ${spacings[spacing]} ${className}`}>
        <div className={`flex-1 h-px ${variants[variant]}`} />
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/40 border border-slate-800/30">
          {Icon && <Icon className="w-4 h-4 text-slate-400" />}
          <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
            {label}
          </span>
        </div>
        <div className={`flex-1 h-px ${variants[variant]}`} />
      </div>
    );
  }

  // Simple divider
  return (
    <div className={`${spacings[spacing]} ${className}`}>
      <div className={`h-px ${variants[variant]}`} />
    </div>
  );
}

interface SectionDividerProps {
  title?: string;
  subtitle?: string;
  spacing?: "sm" | "md" | "lg";
}

export function SectionDivider({
  title,
  subtitle,
  spacing = "lg",
}: SectionDividerProps) {
  return (
    <div className={`${spacings[spacing]}`}>
      <div className="bg-gradient-to-r from-transparent via-slate-700/50 to-transparent h-px" />
      {(title || subtitle) && (
        <div className="mt-4">
          {title && (
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
}
