'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SPRING_PHYSICS, MOTION_TIMING } from '@/constants/advancedMotion';

/**
 * Micro-interaction Framework
 * Cohesive interaction patterns for buttons, inputs, avatars, and pipelines
 * Inspired by Linear, Vercel, Stripe premium interactions
 */

// ============================================================================
// Premium Button Component
// ============================================================================

interface PremiumButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
}

export function PremiumButton({
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  children,
  disabled,
  className,
  ...props
}: PremiumButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const variantStyles = {
    primary: 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-sky-500/50',
    secondary: 'bg-slate-800/50 text-slate-100 border border-slate-700 hover:bg-slate-800 hover:border-slate-600',
    danger: 'bg-red-500/20 text-red-300 border border-red-500/50 hover:bg-red-500/30',
    ghost: 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/30',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      className={`
        relative inline-flex items-center justify-center gap-2
        rounded-lg font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className || ''}
      `}
      whileHover={{ scale: 1.01 }}
      whileTap={!loading ? { scale: 0.98 } : {}}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      disabled={loading || disabled}
      type="button"
    >
      {/* Ripple effect on click */}
      {isPressed && (
        <motion.span
          className="absolute inset-0 rounded-lg bg-white/20"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Loading spinner */}
      {loading && (
        <motion.div
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {!loading && icon && <span className="flex items-center justify-center">{icon}</span>}

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// ============================================================================
// Premium Input with Focus Glow
// ============================================================================

interface PremiumInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export function PremiumInput({
  label,
  error,
  icon,
  helperText,
  className = '',
  ...props
}: PremiumInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full space-y-2">
      {label && (
        <motion.label
          className="block text-sm font-medium text-slate-300"
          animate={{
            opacity: isFocused ? 1 : 0.7,
            y: isFocused ? -2 : 0,
          }}
        >
          {label}
        </motion.label>
      )}

      <motion.div
        className="relative"
        animate={{
          scale: isFocused ? 1.01 : 1,
          borderColor: isFocused ? 'rgba(14, 165, 233, 0.5)' : 'rgba(71, 85, 105, 0.5)',
        }}
        transition={SPRING_PHYSICS.smooth}
      >
        <input
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-slate-900/50 border-2 transition-all
            text-slate-100 placeholder-slate-500
            focus:outline-none
            ${error ? 'border-red-500/50 focus:border-red-500' : isFocused ? 'border-sky-500/50' : 'border-slate-700/50'}
            ${className}
          `}
          {...props}
        />

        {/* Focus glow effect */}
        <motion.div
          className={`
            absolute inset-0 rounded-lg pointer-events-none
            ${error ? 'bg-red-500/5' : 'bg-sky-500/5'}
          `}
          animate={{
            opacity: isFocused ? 1 : 0,
            boxShadow: isFocused ? '0 0 20px rgba(14, 165, 233, 0.2)' : '0 0 0px rgba(14, 165, 233, 0)',
          }}
          transition={SPRING_PHYSICS.smooth}
        />

        {/* Icon */}
        {icon && (
          <motion.div
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            animate={{ scale: isFocused ? 1.1 : 1 }}
            transition={SPRING_PHYSICS.snappy}
          >
            {icon}
          </motion.div>
        )}
      </motion.div>

      {/* Helper text */}
      {helperText && !error && (
        <motion.p
          className="text-xs text-slate-400"
          animate={{ opacity: isFocused ? 1 : 0.5 }}
        >
          {helperText}
        </motion.p>
      )}

      {/* Error message */}
      {error && (
        <motion.p
          className="text-xs text-red-400"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

// ============================================================================
// Premium Avatar with Hover Animation
// ============================================================================

interface PremiumAvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'away';
  interactive?: boolean;
}

export function PremiumAvatar({
  src,
  name,
  size = 'md',
  status,
  interactive = false,
}: PremiumAvatarProps) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const statusDot = {
    online: 'bg-emerald-400',
    offline: 'bg-slate-400',
    away: 'bg-yellow-400',
  };

  return (
    <motion.div
      className={`
        relative inline-flex items-center justify-center rounded-full
        ${sizeMap[size]}
        ${interactive ? 'cursor-pointer' : ''}
        bg-gradient-to-br from-sky-500 to-cyan-500
        overflow-hidden
      `}
      whileHover={interactive ? { scale: 1.1, rotate: 5 } : {}}
      transition={SPRING_PHYSICS.smooth}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-white font-bold text-sm">{name.charAt(0).toUpperCase()}</span>
      )}

      {/* Status indicator */}
      {status && (
        <motion.div
          className={`
            absolute bottom-0 right-0
            w-3 h-3 rounded-full border-2 border-slate-950
            ${statusDot[status]}
          `}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Hover pulse */}
      {interactive && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-sky-400/0"
          whileHover={{ borderColor: 'rgba(56, 189, 248, 0.5)' }}
          transition={SPRING_PHYSICS.smooth}
        />
      )}
    </motion.div>
  );
}

// ============================================================================
// Premium Toggle Switch
// ============================================================================

interface PremiumToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function PremiumToggle({
  checked,
  onChange,
  label,
  disabled = false,
}: PremiumToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <motion.button
        className={`
          relative w-12 h-6 rounded-full transition-colors
          ${checked ? 'bg-sky-500' : 'bg-slate-700'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"
          animate={{
            left: checked ? 'calc(100% - 1.25rem)' : '0.125rem',
          }}
          transition={SPRING_PHYSICS.smooth}
        />
      </motion.button>

      {label && (
        <label className="select-none text-sm font-medium text-slate-300">{label}</label>
      )}
    </div>
  );
}

// ============================================================================
// Premium Slider
// ============================================================================

interface PremiumSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

export function PremiumSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
}: PremiumSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex justify-between">
          <label className="text-sm font-medium text-slate-300">{label}</label>
          <span className="text-sm text-sky-400 font-bold">{value}</span>
        </div>
      )}

      <div className="relative h-2 rounded-full bg-slate-800 overflow-hidden cursor-pointer group">
        {/* Filled track */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full"
          style={{ width: `${percentage}%` }}
          layout
        />

        {/* Thumb */}
        <motion.input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          style={{ appearance: 'none', WebkitAppearance: 'none' }}
        />

        {/* Visual thumb */}
        <motion.div
          className="absolute top-1/2 w-4 h-4 bg-white rounded-full -translate-y-1/2 pointer-events-none shadow-lg"
          style={{ left: `calc(${percentage}% - 8px)` }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.3 }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Premium Badge
// ============================================================================

interface PremiumBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  animated?: boolean;
}

export function PremiumBadge({
  children,
  variant = 'default',
  animated = false,
}: PremiumBadgeProps) {
  const variantStyles = {
    default: 'bg-sky-500/20 text-sky-300 border-sky-500/50',
    success: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
    warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    danger: 'bg-red-500/20 text-red-300 border-red-500/50',
    info: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
  };

  return (
    <motion.span
      className={`
        inline-flex items-center gap-2
        px-3 py-1 rounded-full text-xs font-semibold
        border ${variantStyles[variant]}
      `}
      animate={animated ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity }}
      whileHover={{ scale: 1.05 }}
    >
      {children}
    </motion.span>
  );
}
