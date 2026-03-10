"use client";

import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: "blue" | "sky" | "green" | "purple" | "amber";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, icon, color = "sky", trend }: StatCardProps) {
  const colorStyles = {
    blue: "bg-blue-900/20 border-blue-800 text-blue-400",
    sky: "bg-sky-900/20 border-sky-800 text-sky-400",
    green: "bg-green-900/20 border-green-800 text-green-400",
    purple: "bg-purple-900/20 border-purple-800 text-purple-400",
    amber: "bg-amber-900/20 border-amber-800 text-amber-400",
  };

  const trendColor = trend?.isPositive ? "text-green-400" : "text-red-400";
  const trendIcon = trend?.isPositive ? "↑" : "↓";

  return (
    <div
      className={`rounded-xl border p-6 transition-all duration-200 hover:shadow-lg hover:shadow-slate-900/50 hover:scale-105 cursor-default ${colorStyles[color]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-2">{title}</p>
          <p className="text-3xl font-bold text-slate-50">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 ${trendColor}`}>
              {trendIcon} {Math.abs(trend.value)}% depuis le mois dernier
            </p>
          )}
        </div>
        <div className="text-3xl opacity-60">{icon}</div>
      </div>
    </div>
  );
}

interface KPICardProps {
  label: string;
  value: string | number;
  subtext?: string;
  color?: string;
}

export function KPICard({ label, value, subtext, color = "text-sky-400" }: KPICardProps) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-center hover:bg-slate-900/60 transition-colors duration-200">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
    </div>
  );
}
