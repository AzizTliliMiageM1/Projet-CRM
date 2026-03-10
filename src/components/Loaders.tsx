import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "sky" | "blue" | "green" | "red" | "purple";
  className?: string;
}

const sizes = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const colors = {
  sky: "text-sky-400",
  blue: "text-blue-400",
  green: "text-green-400",
  red: "text-red-400",
  purple: "text-purple-400",
};

export function Spinner({ size = "md", color = "sky", className = "" }: SpinnerProps) {
  return (
    <svg
      className={`animate-spin ${sizes[size]} ${colors[color]} ${className}`}
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
  );
}

interface LoadingSkeletonProps {
  rows?: number;
  variant?: "card" | "line" | "avatar" | "table";
  className?: string;
}

export function LoadingSkeleton({ rows = 3, variant = "line", className = "" }: LoadingSkeletonProps) {
  if (variant === "card") {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="rounded-lg bg-slate-800/50 p-4 animate-pulse">
            <div className="h-6 bg-slate-700/50 rounded w-1/3 mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-700/50 rounded w-full"></div>
              <div className="h-4 bg-slate-700/50 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "avatar") {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="w-12 h-12 rounded-full bg-slate-800/50 animate-pulse"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-800/50 rounded w-1/3 animate-pulse"></div>
          <div className="h-3 bg-slate-800/50 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={`space-y-3 ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex gap-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex-1 h-4 bg-slate-800/50 rounded animate-pulse"></div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Default line variant
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-4 bg-slate-800/50 rounded animate-pulse" style={{ width: `${100 - i * 10}%` }}></div>
      ))}
    </div>
  );
}

interface ProgressProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  color?: "sky" | "green" | "amber" | "red";
  className?: string;
}

const progressColors = {
  sky: "from-sky-500 to-blue-500",
  green: "from-emerald-500 to-green-500",
  amber: "from-amber-500 to-orange-500",
  red: "from-red-500 to-rose-500",
};

export function Progress({ value, max = 100, showLabel = false, color = "sky", className = "" }: ProgressProps) {
  const percentage = (value / max) * 100;

  return (
    <div className={`w-full ${className}`}>
      <div className="relative h-2 rounded-full bg-slate-800/50 overflow-hidden border border-slate-700/50">
        <div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${progressColors[color]} transition-all duration-500 ease-out rounded-full shadow-lg shadow-${color}-500/50`}
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      </div>
      {showLabel && (
        <p className="text-xs text-slate-400 mt-2 text-center">{Math.round(percentage)}%</p>
      )}
    </div>
  );
}

interface LoaderProps {
  label?: string;
  fullScreen?: boolean;
}

export function Loader({ label, fullScreen = false }: LoaderProps) {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <Spinner size="lg" />
      {label && <p className="text-sm text-slate-400 animate-pulse">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  );
}

interface DotsLoaderProps {
  size?: "sm" | "md" | "lg";
  color?: "sky" | "green" | "blue";
}

export function DotsLoader({ size = "md", color = "sky" }: DotsLoaderProps) {
  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const colorClass = {
    sky: "bg-sky-400",
    green: "bg-green-400",
    blue: "bg-blue-400",
  };

  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`rounded-full ${sizes[size]} ${colorClass[color]} animate-bounce`}
          style={{ animationDelay: `${i * 150}ms` }}
        ></div>
      ))}
    </div>
  );
}
