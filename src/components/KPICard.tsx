'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { animateCount, easeOutCubic, formatNumber } from '@/utils/animations';
import { MOTION_TIMINGS } from '@/constants/motionTimings';

interface KPICardProps {
  title: string;
  value: number;
  previousValue?: number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  enableAnimation?: boolean;
  unitSuffix?: string;
}

const variantStyles = {
  default: {
    bg: 'from-slate-900/50 to-slate-950',
    accent: 'sky-400',
    accentLight: 'sky-400/10',
  },
  success: {
    bg: 'from-emerald-900/30 to-emerald-950/20',
    accent: 'emerald-400',
    accentLight: 'emerald-400/10',
  },
  warning: {
    bg: 'from-amber-900/30 to-amber-950/20',
    accent: 'amber-400',
    accentLight: 'amber-400/10',
  },
  danger: {
    bg: 'from-red-900/30 to-red-950/20',
    accent: 'red-400',
    accentLight: 'red-400/10',
  },
};

export function KPICard({
  title,
  value,
  previousValue,
  trend,
  icon,
  variant = 'default',
  enableAnimation = true,
  unitSuffix = '',
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const styles = variantStyles[variant];

  // Animate count on mount
  useEffect(() => {
    if (enableAnimation && !hasAnimated) {
      animateCount(0, value, 1500, (newValue) => {
        setDisplayValue(newValue);
      });
      setHasAnimated(true);
    } else {
      setDisplayValue(value);
    }
  }, [value, enableAnimation, hasAnimated]);

  // Calculate percentage change
  const percentChange =
    previousValue && previousValue > 0
      ? ((value - previousValue) / previousValue) * 100
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`
        relative overflow-hidden rounded-2xl
        bg-gradient-to-br ${styles.bg}
        border border-slate-800/50
        p-6 group cursor-pointer
        transition-all duration-300 ease-out
        hover:shadow-lg hover:shadow-${styles.accent}/20 hover:border-${styles.accent}/30
      `}
    >
      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, rgba(${
            variant === 'default'
              ? '59, 130, 246'
              : variant === 'success'
                ? '34, 197, 94'
                : variant === 'warning'
                  ? '217, 119, 6'
                  : '239, 68, 68'
          }, 0.2) 0%, transparent 70%)`,
        }}
      />

      {/* Animated border */}
      <div
        className={`
          absolute inset-0 rounded-2xl border border-transparent opacity-0
          group-hover:opacity-100 transition-opacity duration-300 pointer-events-none
          bg-gradient-to-r from-${styles.accent}/0 via-${styles.accent}/20 to-${styles.accent}/0
        `}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">
              {title}
            </p>
          </div>
          {icon && (
            <div
              className={`
                text-3xl opacity-60 group-hover:opacity-100
                group-hover:scale-110 transition-all duration-300
                text-${styles.accent}
              `}
            >
              {icon}
            </div>
          )}
        </div>

        {/* Value with count-up animation */}
        <div className="mb-4">
          <motion.div
            className={`
              text-5xl font-bold
              bg-gradient-to-r from-${styles.accent} to-${styles.accent}
              bg-clip-text text-transparent
            `}
            key={displayValue}
          >
            {formatNumber(displayValue)}
            {unitSuffix && <span className="text-lg ml-1 text-slate-400">{unitSuffix}</span>}
          </motion.div>
        </div>

        {/* Trend indicator */}
        {(trend || percentChange !== null) && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className={`
              flex items-center gap-1 text-sm font-semibold
              ${trend ? (trend.isPositive ? 'text-emerald-400' : 'text-red-400') : percentChange && percentChange > 0 ? 'text-emerald-400' : 'text-red-400'}
            `}
          >
            {trend ? (
              <>
                {trend.isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{trend.value}% vs dernier mois</span>
              </>
            ) : percentChange ? (
              <>
                {percentChange > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(percentChange).toFixed(1)}%</span>
              </>
            ) : null}
          </motion.div>
        )}

        {/* Progress bar animation */}
        <motion.div
          className={`
            mt-4 h-1 rounded-full
            bg-gradient-to-r from-${styles.accent}/20 to-${styles.accent}/0
            overflow-hidden
          `}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: easeOutCubic }}
          style={{ originX: 0 }}
        >
          <motion.div
            className={`h-full bg-gradient-to-r from-${styles.accent} to-${styles.accent}/50`}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              backgroundSize: '200% 100%',
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * KPI Grid Component
 * Container pour plusieurs KPI cards avec stagger
 */
interface KPIGridProps {
  cards: KPICardProps[];
  columns?: 1 | 2 | 3 | 4;
}

export function KPIGrid({ cards, columns = 4 }: KPIGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <motion.div
      className={`grid ${columnClasses[columns]} gap-6`}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.1,
          }}
        >
          <KPICard {...card} />
        </motion.div>
      ))}
    </motion.div>
  );
}
