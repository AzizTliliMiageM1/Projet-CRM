'use client';

import React, { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { SPRING_PHYSICS, MOTION_TIMING } from '@/constants/advancedMotion';

/**
 * Advanced Animated Gradient System
 * Inspired by Stripe, Linear, Vercel gradient designs
 */

// ============================================================================
// Animated Gradient Mesh (subtle hue rotation)
// ============================================================================

interface AnimatedGradientMeshProps {
  className?: string;
  colors?: string[];
  speed?: number;
  intensity?: number;
}

export function AnimatedGradientMesh({
  className = '',
  colors = ['from-sky-500', 'via-purple-500', 'to-pink-500'],
  speed = 20,
  intensity = 0.3,
}: AnimatedGradientMeshProps) {
  return (
    <motion.div
      className={`
        relative overflow-hidden
        bg-gradient-to-r ${colors.join(' ')}
        ${className}
      `}
      animate={{
        backgroundPosition: ['0% 0%', '100% 100%'],
        filter: [
          `hue-rotate(0deg) saturate(${intensity})`,
          `hue-rotate(360deg) saturate(${intensity})`,
        ],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        repeatType: 'loop',
      }}
    />
  );
}

// ============================================================================
// Gradient Sweep Hover Effect
// ============================================================================

interface GradientSweepProps {
  children: React.ReactNode;
  className?: string;
  colors?: [string, string];
  duration?: number;
}

export function GradientSweep({
  children,
  className = '',
  colors = ['from-sky-400', 'to-cyan-400'],
  duration = 0.6,
}: GradientSweepProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background sweep overlay */}
      <motion.div
        className={`
          absolute inset-0 -z-10
          bg-gradient-to-r ${colors.join(' ')}
          opacity-0
        `}
        animate={{
          x: isHovered ? 0 : 100,
          opacity: isHovered ? 0.1 : 0,
        }}
        transition={{ duration, ease: 'easeInOut' }}
      />

      {children}
    </motion.div>
  );
}

// ============================================================================
// Animated Gradient Border
// ============================================================================

interface AnimatedGradientBorderProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  borderWidth?: number;
  speed?: number;
}

export function AnimatedGradientBorder({
  children,
  className = '',
  colors = ['#0ea5e9', '#8b5cf6', '#ec4899'],
  borderWidth = 2,
  speed = 4,
}: AnimatedGradientBorderProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        background: `linear-gradient(90deg, ${colors.join(',')}) border-box`,
        borderRadius: '0.5rem',
        padding: borderWidth,
      } as CSSProperties}
      animate={{
        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        repeatType: 'loop',
      }}
    >
      <div className="bg-slate-950 rounded-[calc(0.5rem-2px)]">{children}</div>
    </motion.div>
  );
}

// ============================================================================
// Subtle Hue Rotation (for containers)
// ============================================================================

interface SubtleHueRotationProps {
  children: React.ReactNode;
  className?: string;
  cycle?: number;
}

export function SubtleHueRotation({
  children,
  className = '',
  cycle = 25,
}: SubtleHueRotationProps) {
  return (
    <motion.div
      className={className}
      animate={{
        filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)'],
      }}
      transition={{
        duration: cycle,
        repeat: Infinity,
        repeatType: 'loop',
      }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// Gradient Pulse (for emphasis)
// ============================================================================

interface GradientPulseProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function GradientPulse({
  children,
  className = '',
  intensity = 0.2,
}: GradientPulseProps) {
  return (
    <motion.div
      className={className}
      animate={{
        boxShadow: [
          `0 0 0 0 rgba(14, 165, 233, 0)`,
          `0 0 0 10px rgba(14, 165, 233, ${intensity})`,
          `0 0 0 0 rgba(14, 165, 233, 0)`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// Dynamic Gradient Text
// ============================================================================

interface DynamicGradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animated?: boolean;
}

export function DynamicGradientText({
  children,
  className = '',
  colors = ['#0ea5e9', '#8b5cf6', '#ec4899'],
  animated = true,
}: DynamicGradientTextProps) {
  const gradientText = `
    bg-gradient-to-r ${colors.map((c) => (c.includes('#') ? `[${c}]` : c)).join(' ')}
    bg-clip-text text-transparent
  `;

  if (!animated) {
    return <span className={`${gradientText} ${className}`}>{children}</span>;
  }

  return (
    <motion.span
      className={`${gradientText} ${className}`}
      animate={{
        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: 'loop',
      }}
    >
      {children}
    </motion.span>
  );
}

// ============================================================================
// Multi-Color Gradient Animation
// ============================================================================

interface MultiColorGradientProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  duration?: number;
}

export function MultiColorGradient({
  children,
  className = '',
  colors = [
    'from-sky-500 via-purple-500 to-pink-500',
    'from-purple-500 via-pink-500 to-red-500',
    'from-pink-500 via-red-500 to-orange-500',
    'from-orange-500 via-yellow-500 to-sky-500',
  ],
  duration = 8,
}: MultiColorGradientProps) {
  const gradientClasses = colors.map((c) => `bg-gradient-to-r ${c}`);

  return (
    <motion.div
      className={`${className} transition-all`}
      animate={{
        backgroundImage: colors.map(
          (c) => `linear-gradient(to right, var(--tw-gradient-stops))`
        ),
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'loop',
      }}
      style={{
        backgroundSize: '200% 200%',
      }}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// Gradient Backdrop Blur
// ============================================================================

interface GradientBackdropProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  blur?: 'sm' | 'md' | 'lg' | 'xl';
}

export function GradientBackdrop({
  children,
  className = '',
  colors = ['from-sky-500/20', 'to-purple-500/20'],
  blur = 'lg',
}: GradientBackdropProps) {
  const blurMap = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  return (
    <div
      className={`
        relative
        bg-gradient-to-r ${colors.join(' ')}
        ${blurMap[blur]}
        rounded-lg
        p-6
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// ============================================================================
// Radial Gradient Overlay
// ============================================================================

interface RadialGradientOverlayProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function RadialGradientOverlay({
  children,
  className = '',
  intensity = 0.3,
}: RadialGradientOverlayProps) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-lg ${className}`}
      whileHover="hover"
    >
      {/* Radial overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, rgba(14, 165, 233, ${intensity}) 0%, transparent 70%)`,
          opacity: 0,
        }}
        variants={{
          hover: {
            opacity: 1,
            transition: { duration: MOTION_TIMING.normal / 1000 },
          },
        }}
      />

      {children}
    </motion.div>
  );
}

// ============================================================================
// Shimmer Gradient
// ============================================================================

interface ShimmerGradientProps {
  className?: string;
  speed?: number;
}

export function ShimmerGradient({ className = '', speed = 2 }: ShimmerGradientProps) {
  return (
    <motion.div
      className={`
        h-full bg-gradient-to-r
        from-transparent via-white/20 to-transparent
        ${className}
      `}
      animate={{
        x: ['-100%', '100%'],
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}

// ============================================================================
// Gradient Preset Collections
// ============================================================================

export const GRADIENT_PRESETS = {
  // Premium brand gradients
  premium: {
    sky: 'from-sky-400 via-sky-500 to-cyan-500',
    purple: 'from-purple-400 via-purple-500 to-indigo-500',
    pink: 'from-pink-400 via-pink-500 to-red-500',
    emerald: 'from-emerald-400 via-emerald-500 to-teal-500',
    orange: 'from-orange-400 via-orange-500 to-red-500',
  },

  // Soft gradients (low saturation)
  soft: {
    sky: 'from-sky-300/50 via-sky-400/50 to-cyan-400/50',
    purple: 'from-purple-300/50 via-purple-400/50 to-indigo-400/50',
    pink: 'from-pink-300/50 via-pink-400/50 to-red-400/50',
  },

  // Dark gradients
  dark: {
    sky: 'from-sky-900 via-sky-950 to-cyan-950',
    purple: 'from-purple-900 via-purple-950 to-indigo-950',
    pink: 'from-pink-900 via-pink-950 to-red-950',
  },

  // Multi-color flows
  rainbow: 'from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
  sunset: 'from-orange-400 via-red-500 to-purple-600',
  ocean: 'from-cyan-400 via-blue-500 to-purple-600',
  forest: 'from-green-400 via-emerald-500 to-teal-600',
};
