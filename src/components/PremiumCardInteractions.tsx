'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SPRING_PHYSICS, MOTION_TIMING } from '@/constants/advancedMotion';

/**
 * Premium Card Interactions
 * Inspired by Stripe, Linear, Vercel card designs
 */

// ============================================================================
// Premium Card with Hover Elevation + Radial Highlight
// ============================================================================

interface PremiumInteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  elevation?: boolean;
  glow?: boolean;
  gradient?: boolean;
}

export function PremiumInteractiveCard({
  children,
  className = '',
  title,
  subtitle,
  icon,
  onClick,
  elevation = true,
  glow = true,
  gradient = false,
}: PremiumInteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      className={`
        relative group overflow-hidden rounded-xl
        cursor-pointer
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      whileHover={
        elevation
          ? {
              y: -4,
              scale: 1.01,
            }
          : {}
      }
      transition={SPRING_PHYSICS.smooth}
    >
      {/* Base card background */}
      <motion.div
        className={`
          absolute inset-0 rounded-xl
          ${gradient ? 'bg-gradient-to-br from-slate-800/40 to-slate-900/60' : 'bg-slate-900/40'}
          border border-slate-700/50
          backdrop-blur-md
          transition-all duration-300
        `}
        animate={
          isHovered
            ? {
                background: gradient
                  ? 'linear-gradient(135deg, rgba(51, 65, 85, 0.6), rgba(15, 23, 42, 0.8))'
                  : '',
                borderColor: 'rgba(148, 163, 184, 0.5)',
              }
            : {}
        }
      />

      {/* Radial highlight on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-xl"
        animate={
          isHovered
            ? {
                background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(14, 165, 233, 0.15) 0%, transparent 50%)`,
              }
            : {
                background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(14, 165, 233, 0) 0%, transparent 50%)`,
              }
        }
        transition={{ type: 'tween', duration: 0.1 }}
      />

      {/* Soft shadow bloom on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={
          isHovered
            ? {
                boxShadow: glow
                  ? '0 0 40px rgba(14, 165, 233, 0.25), inset 0 0 40px rgba(14, 165, 233, 0.05)'
                  : '0 8px 32px rgba(0, 0, 0, 0.3)',
              }
            : {
                boxShadow: glow
                  ? '0 0 20px rgba(14, 165, 233, 0.1)'
                  : '0 4px 16px rgba(0, 0, 0, 0.2)',
              }
        }
        transition={SPRING_PHYSICS.smooth}
      />

      {/* Dynamic border glow */}
      {glow && (
        <motion.div
          className="absolute inset-0 rounded-xl border border-sky-400/0 pointer-events-none"
          animate={
            isHovered
              ? {
                  borderColor: 'rgba(56, 189, 248, 0.4)',
                  boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)',
                }
              : {
                  borderColor: 'rgba(56, 189, 248, 0)',
                  boxShadow: '0 0 0px rgba(56, 189, 248, 0)',
                }
          }
          transition={SPRING_PHYSICS.smooth}
        />
      )}

      {/* Content */}
      <div className="relative z-10 p-6">
        {(title || subtitle || icon) && (
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              {(title || subtitle) && (
                <div>
                  {title && <h3 className="text-lg font-semibold text-slate-50">{title}</h3>}
                  {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
                </div>
              )}
              {icon && (
                <motion.div
                  animate={isHovered ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                  transition={SPRING_PHYSICS.snappy}
                  className="text-sky-400"
                >
                  {icon}
                </motion.div>
              )}
            </div>
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
}

// ============================================================================
// Micro Parallax Card
// ============================================================================

interface MicroParallaxCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function MicroParallaxCard({
  children,
  className = '',
  intensity = 15,
}: MicroParallaxCardProps) {
  const [rotateX, setRotateX] = React.useState(0);
  const [rotateY, setRotateY] = React.useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * intensity;
    const rotateYValue = ((centerX - x) / centerX) * intensity;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      className={`${className} perspective`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: `${rotateX}deg`,
        rotateY: `${rotateY}deg`,
      }}
      transition={SPRING_PHYSICS.smooth}
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px)`,
      }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// Gradient Border Animation Card
// ============================================================================

interface GradientBorderCardProps {
  children: React.ReactNode;
  className?: string;
  borderWidth?: number;
  animated?: boolean;
}

export function GradientBorderCard({
  children,
  className = '',
  borderWidth = 2,
  animated = true,
}: GradientBorderCardProps) {
  return (
    <motion.div
      className={`
        relative rounded-xl overflow-hidden
        ${className}
      `}
      animate={
        animated
          ? {
              boxShadow: [
                '0 0 20px rgba(14, 165, 233, 0.2)',
                '0 0 30px rgba(139, 92, 246, 0.2)',
                '0 0 20px rgba(14, 165, 233, 0.2)',
              ],
            }
          : {}
      }
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: 'loop',
      }}
      style={{
        background: `linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(139, 92, 246, 0.2))`,
        padding: borderWidth,
        borderRadius: '0.75rem',
      }}
    >
      <div className="bg-slate-950 rounded-[calc(0.75rem-2px)] overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}

// ============================================================================
// Action Reveal Card
// ============================================================================

interface ActionRevealCardProps {
  children: React.ReactNode;
  actions?: Array<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }>;
  className?: string;
}

export function ActionRevealCard({ children, actions = [], className = '' }: ActionRevealCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card content */}
      <div className="relative z-10 bg-slate-900/40 backdrop-blur-md p-6 rounded-xl border border-slate-700/50">
        {children}
      </div>

      {/* Action buttons overlay */}
      <AnimatePresence>
        {isHovered && actions.length > 0 && (
          <motion.div
            className="absolute top-2 right-2 z-20 flex gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={SPRING_PHYSICS.snappy}
          >
            {actions.map((action, idx) => (
              <motion.button
                key={idx}
                onClick={action.onClick}
                className="p-2 rounded-lg bg-sky-500/20 hover:bg-sky-500/40 text-sky-300 transition-all"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, ...SPRING_PHYSICS.snappy }}
                title={action.label}
              >
                {action.icon}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================================
// Stat Card (with count-up + large number)
// ============================================================================

interface StatCardProps {
  label: string;
  value: number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}

export function StatCard({ label, value, subtitle, icon, trend, className = '' }: StatCardProps) {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const duration = 1500;
    const frames = 60;
    const frameTime = duration / frames;
    const increment = value / frames;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, frameTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <PremiumInteractiveCard className={className} title={label} subtitle={subtitle} icon={icon}>
      <div className="space-y-2">
        <motion.div
          className="text-3xl font-bold text-sky-400"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.5, repeat: 3 }}
        >
          {displayValue.toLocaleString()}
        </motion.div>
        {trend && (
          <motion.div
            className={`text-sm font-medium ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'}`}
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </motion.div>
        )}
      </div>
    </PremiumInteractiveCard>
  );
}
