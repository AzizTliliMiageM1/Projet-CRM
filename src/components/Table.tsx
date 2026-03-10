import React from "react";
import { LucideIcon } from "lucide-react";

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className = "" }: TableProps) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/50 via-slate-900/30 to-slate-950 backdrop-blur-sm shadow-2xl ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max">
          {children}
        </table>
      </div>
    </div>
  );
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function TableHead({ children, className = "" }: TableHeaderProps) {
  return (
    <thead>
      <tr className={`relative border-b border-slate-800/50 bg-gradient-to-r from-slate-800/40 to-slate-900/20 ${className}`}>
        {children}
      </tr>
    </thead>
  );
}

interface TableHeaderCellProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  sortable?: boolean;
  className?: string;
}

export function TableHeaderCell({ children, icon: Icon, sortable = false, className = "" }: TableHeaderCellProps) {
  return (
    <th className={`px-6 py-5 text-left ${className}`}>
      <div className="flex items-center gap-2 cursor-pointer group">
        {Icon && <Icon className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />}
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">
          {children}
        </span>
        {sortable && (
          <span className="text-slate-500 group-hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100">
            ↕
          </span>
        )}
      </div>
    </th>
  );
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function TableBody({ children, className = "" }: TableBodyProps) {
  return (
    <tbody className={className}>
      {children}
    </tbody>
  );
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export function TableRow({ children, className = "", onClick, isSelected = false }: TableRowProps) {
  return (
    <tr 
      onClick={onClick}
      className={`
        relative group border-b border-slate-800/30 
        hover:bg-slate-800/30 
        transition-all duration-200 ease-out
        cursor-pointer
        ${isSelected ? "bg-sky-500/10 border-sky-500/30" : ""}
        ${className}
      `}
    >
      {/* Hover line effect */}
      <td colSpan={999} className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-sky-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </td>
      
      {children}
    </tr>
  );
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export function TableCell({ children, className = "" }: TableCellProps) {
  return (
    <td className={`px-6 py-4 text-sm text-slate-300 relative z-10 ${className}`}>
      {children}
    </td>
  );
}

interface TableActionProps {
  children: React.ReactNode;
  className?: string;
}

export function TableActions({ children, className = "" }: TableActionProps) {
  return (
    <td className={`px-6 py-4 text-right relative z-10 ${className}`}>
      <div className="flex items-center justify-end gap-2">
        {children}
      </div>
    </td>
  );
}

interface TableEmptyProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  colSpan?: number;
}

export function TableEmpty({ icon: Icon, title, description, colSpan = 999 }: TableEmptyProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-12 text-center">
        <div className="flex flex-col items-center gap-3">
          {Icon && <Icon className="w-12 h-12 text-slate-500 opacity-50" />}
          <div>
            <p className="text-slate-300 font-medium">{title}</p>
            {description && <p className="text-sm text-slate-400 mt-1">{description}</p>}
          </div>
        </div>
      </td>
    </tr>
  );
}

interface TableSkeletonProps {
  rows?: number;
  colSpan?: number;
}

export function TableSkeleton({ rows = 5, colSpan = 999 }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-slate-800/30">
          <td colSpan={colSpan} className="px-6 py-4">
            <div className="flex gap-4">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="flex-1">
                  <div className="h-4 bg-slate-800/50 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
