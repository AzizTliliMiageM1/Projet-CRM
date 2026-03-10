import React, { memo } from 'react';

/**
 * Skeleton loaders for better perceived performance
 * Displays placeholder content while data is loading
 */

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

/**
 * Generic skeleton line component
 */
export const SkeletonLine = memo(function SkeletonLine({
  width = 'w-full',
  height = 'h-4',
  className = '',
}: SkeletonProps) {
  return (
    <div className={`${width} ${height} bg-slate-800/50 rounded animate-pulse ${className}`}></div>
  );
});

/**
 * Table skeleton - multiple rows
 */
export const SkeletonTable = memo(function SkeletonTable({ count = 5 }: SkeletonProps) {
  return (
    <div className="space-y-2 w-full">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="p-4 border border-slate-800/30 rounded-lg flex gap-4">
          <SkeletonLine width="w-12" height="h-12" className="rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonLine width="w-3/4" height="h-4" />
            <SkeletonLine width="w-1/2" height="h-3" />
          </div>
          <SkeletonLine width="w-20" height="h-8" className="self-center" />
        </div>
      ))}
    </div>
  );
});

/**
 * Dashboard KPI card skeleton
 */
export const SkeletonKPICard = memo(function SkeletonKPICard() {
  return (
    <div className="rounded-xl border border-slate-800/30 bg-slate-900/20 p-6">
      <div className="space-y-3">
        <SkeletonLine width="w-1/3" height="h-4" />
        <SkeletonLine width="w-1/2" height="h-8" />
        <SkeletonLine width="w-1/4" height="h-3" />
      </div>
    </div>
  );
});

/**
 * Chart skeleton
 */
export const SkeletonChart = memo(function SkeletonChart() {
  return (
    <div className="rounded-xl border border-slate-800/30 bg-slate-900/20 p-6">
      <SkeletonLine width="w-1/3" height="h-5" className="mb-4" />
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <SkeletonLine width="w-16" height="h-8" className="flex-shrink-0" />
            <SkeletonLine width={`w-${(i % 5 + 1) * 20}`} height="h-8" className="flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
});

/**
 * Form field skeleton
 */
export const SkeletonFormField = memo(function SkeletonFormField() {
  return (
    <div className="space-y-2">
      <SkeletonLine width="w-1/4" height="h-4" />
      <SkeletonLine width="w-full" height="h-10" className="rounded-lg" />
    </div>
  );
});

/**
 * Dashboard overview skeleton - full page loading state
 */
export const SkeletonDashboardOverview = memo(function SkeletonDashboardOverview() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <SkeletonLine width="w-1/4" height="h-6" className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonKPICard key={i} />
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <SkeletonChart key={i} />
        ))}
      </div>

      {/* Table */}
      <div>
        <SkeletonLine width="w-1/4" height="h-6" className="mb-4" />
        <SkeletonTable count={4} />
      </div>
    </div>
  );
});

/**
 * Modal skeleton for forms
 */
export const SkeletonModal = memo(function SkeletonModal() {
  return (
    <div className="space-y-4">
      <SkeletonLine width="w-1/2" height="h-6" />
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <SkeletonFormField key={i} />
        ))}
      </div>
      <div className="flex gap-2 justify-end pt-4">
        <SkeletonLine width="w-20" height="h-10" className="rounded-lg" />
        <SkeletonLine width="w-20" height="h-10" className="rounded-lg" />
      </div>
    </div>
  );
});
