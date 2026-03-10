'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MOTION_TIMING, SPRING_PHYSICS } from '@/constants/advancedMotion';

/**
 * Chart Motion Design
 * Advanced data visualization animations inspired by Stripe, Vercel dashboards
 * Works with Recharts and SVG charts
 */

// ============================================================================
// Animated Line Drawing
// ============================================================================

interface AnimatedLineProps {
  data: Array<{ x: number; y: number }>;
  width: number;
  height: number;
  strokeColor?: string;
  strokeWidth?: number;
  delay?: number;
}

export function AnimatedLinePath({
  data,
  width,
  height,
  strokeColor = '#0ea5e9',
  strokeWidth = 2,
  delay = 0,
}: AnimatedLineProps) {
  if (data.length < 2) return null;

  // Create SVG path string
  const pathString = data
    .map((point, idx) => `${idx === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  // Calculate path length for stroke animation
  const pathRef = React.useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = React.useState(0);

  React.useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  return (
    <svg width={width} height={height} className="overflow-visible">
      <motion.path
        ref={pathRef}
        d={pathString}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ strokeDashoffset: pathLength }}
        animate={{ strokeDashoffset: 0 }}
        transition={{
          duration: 2,
          delay,
          ease: 'easeInOut',
        }}
        style={{
          strokeDasharray: pathLength,
        }}
      />
    </svg>
  );
}

// ============================================================================
// Animated Bar Chart
// ============================================================================

interface Bar {
  label: string;
  value: number;
  color?: string;
}

interface AnimatedBarChartProps {
  bars: Bar[];
  maxValue?: number;
  height?: number;
  barWidth?: number;
  gap?: number;
  animated?: boolean;
}

export function AnimatedBarChart({
  bars,
  maxValue,
  height = 200,
  barWidth = 40,
  gap = 16,
  animated = true,
}: AnimatedBarChartProps) {
  const max = maxValue || Math.max(...bars.map((b) => b.value), 1);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0,
      },
    },
  };

  const barVariants = {
    hidden: { scaleY: 0, opacity: 0 },
    visible: { scaleY: 1, opacity: 1, transition: { duration: 0.6, ...SPRING_PHYSICS.smooth } },
  };

  return (
    <motion.div
      className="flex items-end justify-center gap-4"
      style={{ height }}
      variants={containerVariants}
      initial={animated ? 'hidden' : 'visible'}
      animate={animated ? 'visible' : 'visible'}
    >
      {bars.map((bar, idx) => (
        <motion.div
          key={idx}
          className="relative flex flex-col items-center"
          variants={barVariants}
          transition={{ delay: idx * 0.05 }}
        >
          {/* Bar with gradient */}
          <motion.div
            className={`
              relative rounded-t-lg
              bg-gradient-to-t ${bar.color || 'from-sky-400 to-sky-500'}
              w-${Math.round(barWidth / 4)}
              shadow-lg
              group cursor-pointer
            `}
            style={{
              width: barWidth,
              height: `${(bar.value / max) * height}px`,
            }}
            whileHover={{ scale: 1.05, y: -4 }}
            transition={SPRING_PHYSICS.smooth}
          >
            {/* Hover tooltip */}
            <motion.div
              className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 px-3 py-2 rounded-lg text-xs font-medium text-slate-100 whitespace-nowrap opacity-0 pointer-events-none"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {bar.value}
            </motion.div>
          </motion.div>

          {/* Label */}
          <motion.span className="mt-2 text-xs font-medium text-slate-400 text-center">{bar.label}</motion.span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ============================================================================
// Animated Donut/Pie Chart
// ============================================================================

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface AnimatedDonutChartProps {
  segments: DonutSegment[];
  size?: number;
  innerRadius?: number;
  animated?: boolean;
}

export function AnimatedDonutChart({
  segments,
  size = 200,
  innerRadius = 60,
  animated = true,
}: AnimatedDonutChartProps) {
  const total = segments.reduce((sum, seg) => sum + seg.value, 0);
  const radius = size / 2;
  let currentAngle = -Math.PI / 2; // Start from top

  const paths = segments.map((segment) => {
    const sliceAngle = (segment.value / total) * Math.PI * 2;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;

    const x1 = radius + radius * Math.cos(startAngle);
    const y1 = radius + radius * Math.sin(startAngle);
    const x2 = radius + radius * Math.cos(endAngle);
    const y2 = radius + radius * Math.sin(endAngle);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;

    const ix1 = radius + innerRadius * Math.cos(startAngle);
    const iy1 = radius + innerRadius * Math.sin(startAngle);
    const ix2 = radius + innerRadius * Math.cos(endAngle);
    const iy2 = radius + innerRadius * Math.sin(endAngle);

    const pathString = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;

    currentAngle = endAngle;
    return { ...segment, pathString };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {paths.map((path, idx) => (
        <motion.path
          key={idx}
          d={path.pathString}
          fill={path.color}
          initial={animated ? { opacity: 0 } : { opacity: 1 }}
          animate={{ opacity: 1 }}
          transition={{ delay: idx * 0.1, duration: 0.5 }}
          className="hover:filter hover:brightness-110 cursor-pointer transition-all"
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.filter = 'brightness(1.2)';
            el.style.transition = 'all 200ms ease';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget;
            el.style.filter = 'brightness(1)';
          }}
        />
      ))}
    </svg>
  );
}

// ============================================================================
// Gradient Bar Fill Animation
// ============================================================================

interface GradientBarProps {
  value: number;
  maxValue?: number;
  label?: string;
  color?: string;
  animated?: boolean;
  showLabel?: boolean;
}

export function GradientBar({
  value,
  maxValue = 100,
  label,
  color = 'from-sky-400 to-cyan-400',
  animated = true,
  showLabel = true,
}: GradientBarProps) {
  const percentage = (value / maxValue) * 100;

  return (
    <div className="w-full space-y-2">
      {showLabel && label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-300">{label}</span>
          <span className="text-xs text-slate-400">{percentage.toFixed(0)}%</span>
        </div>
      )}

      <div className="relative h-2 rounded-full bg-slate-800/50 overflow-hidden border border-slate-700/50">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${color} shadow-lg`}
          initial={animated ? { scaleX: 0 } : { scaleX: percentage / 100 }}
          animate={{ scaleX: percentage / 100 }}
          transition={{
            duration: 1.5,
            delay: 0.2,
            ease: 'easeOut',
            ...SPRING_PHYSICS.smooth,
          }}
          style={{ originX: 0 }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Animated Data Point with Hover Glow
// ============================================================================

interface AnimatedDataPointProps {
  x: number;
  y: number;
  value?: number | string;
  color?: string;
  size?: number;
}

export function AnimatedDataPoint({
  x,
  y,
  value,
  color = '#0ea5e9',
  size = 8,
}: AnimatedDataPointProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <g onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Glow effect on hover */}
      <motion.circle
        cx={x}
        cy={y}
        r={size}
        fill="none"
        stroke={color}
        strokeWidth={2}
        opacity="0.3"
        animate={isHovered ? { r: size * 3, opacity: 0 } : { r: size, opacity: 0.3 }}
        transition={{ duration: 0.6 }}
      />

      {/* Main point */}
      <motion.circle
        cx={x}
        cy={y}
        r={size}
        fill={color}
        whileHover={{ r: size * 1.5, filter: 'brightness(1.2)' }}
        transition={SPRING_PHYSICS.smooth}
      />

      {/* Tooltip on hover */}
      {isHovered && value && (
        <motion.text
          x={x}
          y={y - 20}
          textAnchor="middle"
          className="fill-slate-100 text-xs font-medium"
          initial={{ opacity: 0, y: y - 30 }}
          animate={{ opacity: 1, y: y - 20 }}
          exit={{ opacity: 0, y: y - 30 }}
        >
          {value}
        </motion.text>
      )}
    </g>
  );
}

// ============================================================================
// Chart Loading Skeleton
// ============================================================================

export function ChartLoadingSkeleton() {
  return (
    <div className="space-y-4 p-6">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="h-4 bg-gradient-to-r from-slate-800 to-slate-700 rounded"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Metric Trend Indicator
// ============================================================================

interface MetricTrendProps {
  current: number;
  previous: number;
  label: string;
  format?: (val: number) => string;
}

export function MetricTrend({ current, previous, label, format }: MetricTrendProps) {
  const change = current - previous;
  const percentChange = ((change / previous) * 100).toFixed(1);
  const isPositive = change >= 0;

  return (
    <motion.div
      className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/50"
      whileHover={{ scale: 1.01 }}
      transition={SPRING_PHYSICS.smooth}
    >
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="text-lg font-bold text-slate-100 mt-1">
          {format ? format(current) : current.toLocaleString()}
        </p>
      </div>

      <motion.div
        className={`text-right ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <p className="text-2xl font-bold">{isPositive ? '↑' : '↓'}</p>
        <p className="text-sm">{Math.abs(Number(percentChange))}%</p>
      </motion.div>
    </motion.div>
  );
}
