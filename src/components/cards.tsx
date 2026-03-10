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
    blue: "from-blue-900/40 to-blue-800/20 border-blue-600/40 text-blue-400 glow-blue",
    sky: "from-sky-900/40 to-sky-800/20 border-sky-600/40 text-sky-400 glow-sky",
    green: "from-green-900/40 to-green-800/20 border-green-600/40 text-green-400 glow-green",
    purple: "from-purple-900/40 to-purple-800/20 border-purple-600/40 text-purple-400 glow-purple",
    amber: "from-amber-900/40 to-amber-800/20 border-amber-600/40 text-amber-400 glow-amber",
  };

  const glowColor = {
    blue: "group-hover:shadow-blue-500/20",
    sky: "group-hover:shadow-sky-500/20",
    green: "group-hover:shadow-green-500/20",
    purple: "group-hover:shadow-purple-500/20",
    amber: "group-hover:shadow-amber-500/20",
  };

  const trendColor = trend?.isPositive ? "text-green-400" : "text-red-400";
  const trendIcon = trend?.isPositive ? "↑" : "↓";

  return (
    <div className="group relative">
      {/* Gradient background from color */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorStyles[color]} opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl`}
      ></div>

      <div
        className={`relative rounded-2xl border backdrop-blur-sm bg-gradient-to-br ${colorStyles[color]} p-6 transition-all duration-300 overflow-hidden group-hover:shadow-2xl ${glowColor[color]} group-hover:-translate-y-1`}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/5 to-transparent"></div>

        <div className="relative z-10 flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-widest letter-spacing">
              {title}
            </p>
            <p className="text-4xl font-black bg-gradient-to-r from-slate-50 to-slate-200 bg-clip-text text-transparent">
              {value}
            </p>
            {trend && (
              <p className={`text-xs mt-3 font-semibold flex items-center gap-1 ${trendColor}`}>
                <span className="text-lg">{trendIcon}</span>
                <span>{Math.abs(trend.value)}% depuis le mois dernier</span>
              </p>
            )}
          </div>
          <div className="text-5xl opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 transform">
            {icon}
          </div>
        </div>

        {/* Border glow */}
        <div className={`absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r ${
          color === 'blue' ? 'from-blue-500/0 via-blue-500/20 to-blue-500/0' :
          color === 'sky' ? 'from-sky-500/0 via-sky-500/20 to-sky-500/0' :
          color === 'green' ? 'from-green-500/0 via-green-500/20 to-green-500/0' :
          color === 'purple' ? 'from-purple-500/0 via-purple-500/20 to-purple-500/0' :
          'from-amber-500/0 via-amber-500/20 to-amber-500/0'
        } opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
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
