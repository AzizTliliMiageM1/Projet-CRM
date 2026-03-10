'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SPRING_PHYSICS } from '@/constants/advancedMotion';

/**
 * Premium Glassmorphism Components
 * Multi-layered depth system inspired by Stripe/Vercel/Linear
 */

// ============================================================================
// Layer 1: Background Gradient Mesh
// ============================================================================

export function GlassBackgroundMesh() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      {/* Animated gradient blobs */}
      <motion.div
        className="absolute w-96 h-96 -top-40 -left-40 bg-gradient-to-r from-sky-500/20 to-cyan-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 20, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      <motion.div
        className="absolute w-96 h-96 -bottom-40 -right-40 bg-gradient-to-l from-purple-500/20 to-pink-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 0.95, 1],
          x: [0, -20, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      {/* Grid overlay (subtle) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
    </div>
  );
}

// ============================================================================
// Layer 2: Glass Panel
// ============================================================================

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  interactive?: boolean;
}

export function GlassPanel({
  children,
  className = '',
  blur = 'lg',
  glow = false,
  interactive = false,
}: GlassPanelProps) {
  const blurMap = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  };

  return (
    <motion.div
      className={`
        relative rounded-xl
        border border-white/10 shadow-lg
        bg-gradient-to-br from-white/5 to-white/2
        ${blurMap[blur]}
        ${glow ? 'shadow-[0_0_30px_rgba(14,165,233,0.1)]' : ''}
        ${interactive ? 'hover:bg-white/8 hover:border-white/20 cursor-pointer' : ''}
        transition-all duration-300
        ${className}
      `}
      whileHover={
        interactive
          ? {
              borderColor: 'rgba(255, 255, 255, 0.2)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              boxShadow: '0 0 40px rgba(14, 165, 233, 0.15)',
            }
          : {}
      }
      transition={SPRING_PHYSICS.smooth}
    >
      {/* Soft inner glow */}
      {glow && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-500/5 to-transparent pointer-events-none" />
      )}

      {children}
    </motion.div>
  );
}

// ============================================================================
// Layer 3: Premium Card (with hover elevation + glow)
// ============================================================================

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  glowing?: boolean;
  gradient?: boolean;
}

export function PremiumCard({
  children,
  className = '',
  hoverable = true,
  glowing = true,
  gradient = false,
}: PremiumCardProps) {
  return (
    <motion.div
      className={`
        relative rounded-lg p-4
        ${gradient
          ? 'bg-gradient-to-br from-slate-800/50 to-slate-900/50'
          : 'bg-slate-900/40'}
        border border-slate-700/50
        ${glowing
          ? 'shadow-[0_0_20px_rgba(14,165,233,0.1)]'
          : 'shadow-md'}
        backdrop-blur-md
        ${hoverable ? 'hover:shadow-[0_0_30px_rgba(14,165,233,0.2)]' : ''}
        transition-all duration-300
        ${className}
      `}
      whileHover={
        hoverable
          ? {
              y: -4,
              scale: 1.01,
              boxShadow: '0 0 30px rgba(14, 165, 233, 0.2)',
            }
          : {}
      }
      transition={SPRING_PHYSICS.smooth}
    >
      {/* Radial gradient overlay on hover */}
      {hoverable && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-br from-sky-500/20 to-transparent opacity-0 pointer-events-none"
          whileHover={{ opacity: 0.1 }}
          transition={SPRING_PHYSICS.smooth}
        />
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// ============================================================================
// Layer 4: Interactive Overlay
// ============================================================================

interface InteractiveOverlayProps {
  children: React.ReactNode;
  className?: string;
  onHover?: (hovering: boolean) => void;
}

export function InteractiveOverlay({
  children,
  className = '',
  onHover,
}: InteractiveOverlayProps) {
  return (
    <motion.div
      className={`
        relative
        rounded-lg
        cursor-pointer
        group
        ${className}
      `}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      whileHover={{ scale: 1.02 }}
      transition={SPRING_PHYSICS.smooth}
    >
      {/* Hover border glow */}
      <motion.div
        className="absolute inset-0 rounded-lg border border-sky-400/0 pointer-events-none"
        whileHover={{ borderColor: 'rgba(56, 189, 248, 0.3)' }}
        transition={SPRING_PHYSICS.smooth}
      />

      {/* Hover radial glow */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, rgba(14, 165, 233, 0.2) 0%, transparent 70%)',
        }}
        whileHover={{ opacity: 1 }}
        transition={SPRING_PHYSICS.smooth}
      />

      {children}
    </motion.div>
  );
}

// ============================================================================
// Layered Card Stack (for complex compositions)
// ============================================================================

interface LayeredStackProps {
  children: React.ReactNode;
  className?: string;
}

export function LayeredStack({ children, className = '' }: LayeredStackProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Layer backdrop */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-800/20 to-slate-900/20 blur-xl -z-10" />

      {/* Main content */}
      <GlassPanel blur="xl" glow className="relative z-0">
        {children}
      </GlassPanel>
    </div>
  );
}

// ============================================================================
// Depth Layering System
// ============================================================================

export const DEPTH_LAYERS = {
  // Layer 1: Background mesh (z: -50)
  backgroundMesh: 'z-[-50]',

  // Layer 2: Glass panels (z: 0-10)
  glass: 'z-0',
  glassElevated: 'z-10',

  // Layer 3: Cards (z: 20-30)
  card: 'z-20',
  cardElevated: 'z-30',

  // Layer 4: Interactive elements (z: 40-50)
  interactive: 'z-40',
  interactiveHover: 'z-50',

  // UI layers
  modal: 'z-[100]',
  tooltip: 'z-[200]',
  dropdown: 'z-[300]',
};

// ============================================================================
// Soft Shadow Diffusion System
// ============================================================================

export const SHADOW_DIFFUSION = {
  // Soft, subtle shadow (for cards)
  soft: 'shadow-[0_4px_12px_rgba(0,0,0,0.15)]',

  // Medium shadow (for elevated cards)
  medium: 'shadow-[0_8px_24px_rgba(0,0,0,0.25)]',

  // Strong shadow (for overlays)
  strong: 'shadow-[0_12px_40px_rgba(0,0,0,0.35)]',

  // Glow shadow (for interactive elements)
  glow: 'shadow-[0_0_30px_rgba(14,165,233,0.2)]',

  // Bloom shadow (for hover states)
  bloom: 'shadow-[0_0_40px_rgba(14,165,233,0.3)]',
};

// ============================================================================
// Glass Border Gradient System
// ============================================================================

export function GlassBorderGradient() {
  return (
    <>
      {/* Top-left to bottom-right gradient */}
      <style>{`
        @keyframes border-flow {
          0% {
            border-image: linear-gradient(45deg, rgba(56, 189, 248, 0.5), rgba(14, 165, 233, 0.2)) 0;
          }
          50% {
            border-image: linear-gradient(45deg, rgba(139, 92, 246, 0.5), rgba(14, 165, 233, 0.2)) 0;
          }
          100% {
            border-image: linear-gradient(45deg, rgba(56, 189, 248, 0.5), rgba(14, 165, 233, 0.2)) 0;
          }
        }

        .glass-border-gradient {
          animation: border-flow 8s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

// ============================================================================
// Component composition helper
// ============================================================================

export function createGlassComponent(
  Component: React.ComponentType<any>,
  glassProps?: React.ComponentProps<typeof GlassPanel>
) {
  return React.forwardRef((props, ref) => (
    <GlassPanel {...glassProps}>
      <Component ref={ref} {...props} />
    </GlassPanel>
  ));
}
