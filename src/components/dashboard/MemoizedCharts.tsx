import React, { memo, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ChartProps {
  data: any[];
  title?: string;
  height?: number;
}

/**
 * Memoized LineChart component to prevent unnecessary re-renders
 * Only re-renders if data actually changes
 */
export const MemoizedLineChart = memo(function LineChartComponent({
  data,
  title = 'Line Chart',
  height = 300,
}: ChartProps) {
  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-semibold text-slate-200 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9', r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

/**
 * Memoized BarChart component to prevent unnecessary re-renders
 */
export const MemoizedBarChart = memo(function BarChartComponent({
  data,
  title = 'Bar Chart',
  height = 300,
}: ChartProps) {
  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-semibold text-slate-200 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

/**
 * Memoized PieChart component to prevent unnecessary re-renders
 */
export const MemoizedPieChart = memo(function PieChartComponent({
  data,
  title = 'Pie Chart',
  height = 300,
}: ChartProps & { colors?: string[] }) {
  const COLORS = ['#0ea5e9', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-semibold text-slate-200 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

/**
 * Memoized card component for KPIs
 */
interface KPICardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  gradient?: string;
}

export const MemoizedKPICard = memo(function KPICardComponent({
  label,
  value,
  icon,
  trend,
  gradient = 'from-sky-500/20 to-blue-600/20',
}: KPICardProps) {
  return (
    <div className={`rounded-xl border border-slate-800 bg-gradient-to-br ${gradient} p-6 hover:border-slate-700 transition-all`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400 font-medium">{label}</p>
          <p className="text-2xl font-bold text-slate-50 mt-2">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 font-semibold ${trend.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && <div className="text-slate-500 flex-shrink-0">{icon}</div>}
      </div>
    </div>
  );
});
