"use client";

import React from "react";

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

export function ResponsiveTable({ children, className = "" }: ResponsiveTableProps) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-lg ${className}`}>
      <div className="min-w-max inline-block w-full">{children}</div>
    </div>
  );
}
