'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ChartAnimationWrapperProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  enableGradient?: boolean;
}

/**
 * Chart Animation Wrapper
 * Anime les graphiques Recharts à l'entrée
 */
export function ChartAnimationWrapper({
  children,
  delay = 0,
  duration = 0.6,
  enableGradient = true,
}: ChartAnimationWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0, 0, 0.2, 1],
      }}
    >
      {/* Glow overlay on hover */}
      {enableGradient && (
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-blue-400/10 to-transparent" />
      )}

      {children}
    </motion.div>
  );
}

/**
 * Animated Bar Component
 * Pour barres de graphique avec animation d'entrée
 */
interface AnimatedBarProps {
  value: number;
  maxValue: number;
  color?: string;
  label?: string;
  animated?: boolean;
  delay?: number;
}

export function AnimatedBar({
  value,
  maxValue,
  color = 'bg-gradient-to-r from-sky-400 to-blue-600',
  label,
  animated = true,
  delay = 0,
}: AnimatedBarProps) {
  const percentage = (value / maxValue) * 100;

  return (
    <motion.div
      initial={animated ? { width: 0 } : { width: `${percentage}%` }}
      animate={{ width: `${percentage}%` }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className={`h-full ${color} rounded-full relative group`}
    >
      {/* Animated shine effect */}
      {animated && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['0%', '100%'],
          }}
          transition={{
            duration: 1.5,
            delay: delay + 0.4,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      )}

      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 bg-current opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-300 rounded-full"
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
      />

      {label && (
        <motion.span
          className="absolute -top-6 left-0 text-xs font-semibold text-slate-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          {label}
        </motion.span>
      )}
    </motion.div>
  );
}

/**
 * Animated Line Chart Wrapper
 * Pour animer les lignes de graphique
 */
interface AnimatedChartPointProps {
  x: number;
  y: number;
  value?: number;
  color?: string;
  animated?: boolean;
  delay?: number;
}

export function AnimatedChartPoint({
  x,
  y,
  value,
  color = 'sky-400',
  animated = true,
  delay = 0,
}: AnimatedChartPointProps) {
  return (
    <motion.g>
      {/* Point circle */}
      <motion.circle
        cx={x}
        cy={y}
        r={4}
        fill={`rgb(${color === 'sky-400' ? '56, 189, 248' : '59, 130, 246'})`}
        initial={animated ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.5 }}
        transition={{
          duration: 0.4,
          delay,
          ease: 'easeOut',
        }}
      />

      {/* Glow on hover */}
      <motion.circle
        cx={x}
        cy={y}
        r={8}
        fill="none"
        stroke={`rgb(${color === 'sky-400' ? '56, 189, 248' : '59, 130, 246'})`}
        strokeWidth={2}
        opacity={0}
        whileHover={{ opacity: 0.5 }}
        transition={{ duration: 0.2 }}
      />

      {/* Value label on hover */}
      {value && (
        <motion.text
          x={x}
          y={y - 12}
          textAnchor="middle"
          className="text-xs font-semibold fill-slate-300"
          initial={{ opacity: 0, y: y + 5 }}
          whileHover={{ opacity: 1, y: y - 12 }}
          transition={{ duration: 0.2 }}
        >
          {value}
        </motion.text>
      )}
    </motion.g>
  );
}

/**
 * Chart Gradient Definition
 * Pour les gradients animés sur Recharts
 */
export function ChartGradientDefs() {
  return (
    <defs>
      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
        <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
      </linearGradient>

      <linearGradient id="chartGradientSuccess" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(34, 197, 94, 0.8)" />
        <stop offset="100%" stopColor="rgba(34, 197, 94, 0.1)" />
      </linearGradient>

      <linearGradient id="chartGradientDanger" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(239, 68, 68, 0.8)" />
        <stop offset="100%" stopColor="rgba(239, 68, 68, 0.1)" />
      </linearGradient>

      <filter id="chartGlow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

/**
 * Staggered Bar Chart Animation
 * Anime tous les barres en cascade
 */
interface StaggeredBarsProps {
  bars: Array<{ label: string; value: number }>;
  maxValue?: number;
  color?: string;
}

export function StaggeredBars({
  bars,
  maxValue = Math.max(...bars.map((b) => b.value)),
  color = 'bg-gradient-to-r from-sky-400 to-blue-600',
}: StaggeredBarsProps) {
  return (
    <div className="space-y-3">
      {bars.map((bar, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.3,
            delay: index * 0.1,
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-slate-300">{bar.label}</span>
            <span className="text-xs text-slate-400">{bar.value}</span>
          </div>

          <div className="h-3 bg-slate-800/50 rounded-full overflow-hidden">
            <AnimatedBar
              value={bar.value}
              maxValue={maxValue}
              color={color}
              animated={true}
              delay={0.2 + index * 0.1}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Loading Skeleton for Charts
 */
export function ChartSkeleton() {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="h-16 bg-slate-800/50 rounded-lg"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          style={{
            backgroundSize: '200% 100%',
            backgroundImage:
              'linear-gradient(90deg, rgba(0,0,0,0.04), rgba(0,0,0,0.08), rgba(0,0,0,0.04))',
          }}
        />
      ))}
    </motion.div>
  );
}
