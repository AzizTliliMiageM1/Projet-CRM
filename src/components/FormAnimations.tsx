'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Animated Input Field
 */
interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helpText?: string;
}

export function AnimatedInput({
  label,
  error,
  success,
  helpText,
  className = '',
  ...props
}: AnimatedInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <motion.label
          className={`
            block text-sm font-medium mb-2 transition-colors
            ${error ? 'text-red-400' : success ? 'text-emerald-400' : 'text-slate-300'}
          `}
          animate={{
            y: isFocused ? -4 : 0,
            opacity: isFocused ? 1 : 0.8,
          }}
        >
          {label}
        </motion.label>
      )}

      <motion.div
        className="relative"
        animate={{
          scale: isFocused ? 1.01 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <input
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-slate-900/50 border-2 transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950
            ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30' : success ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/30' : 'border-slate-700 focus:border-sky-500 focus:ring-sky-500/30'}
            text-slate-200 placeholder-slate-500
            ${className}
          `}
          {...props}
        />

        {/* Focus glow effect */}
        <motion.div
          className={`
            absolute inset-0 rounded-lg pointer-events-none
            ${error ? 'bg-red-500/5' : success ? 'bg-emerald-500/5' : 'bg-sky-500/5'}
          `}
          animate={{
            opacity: isFocused ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Success checkmark */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-400"
            >
              <CheckCircle className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error icon */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-400"
            >
              <AlertCircle className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error message with animation */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10, x: -10 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -10, x: -10 }}
            className="mt-2 text-sm text-red-400 flex items-center gap-1"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Help text */}
      <AnimatePresence>
        {helpText && !error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-2 text-xs text-slate-400"
          >
            {helpText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Animated Textarea
 */
interface AnimatedTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
}

export function AnimatedTextarea({
  label,
  error,
  maxLength,
  className = '',
  ...props
}: AnimatedTextareaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);

  return (
    <div className="w-full">
      {label && (
        <motion.label
          className={`
            block text-sm font-medium mb-2
            ${error ? 'text-red-400' : 'text-slate-300'}
          `}
          animate={{
            y: isFocused ? -4 : 0,
          }}
        >
          {label}
        </motion.label>
      )}

      <motion.div
        className="relative"
        animate={{
          scale: isFocused ? 1.01 : 1,
        }}
      >
        <textarea
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setCharCount(e.target.value.length)}
          className={`
            w-full px-4 py-2.5 rounded-lg resize-none
            bg-slate-900/50 border-2 transition-all duration-200
            focus:outline-none focus:ring-2
            ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30' : 'border-slate-700 focus:border-sky-500 focus:ring-sky-500/30'}
            text-slate-200 placeholder-slate-500
            ${className}
          `}
          {...props}
          maxLength={maxLength}
        />

        {/* Char count */}
        {maxLength && (
          <motion.span
            className="absolute bottom-2 right-4 text-xs text-slate-500"
            animate={{
              color: charCount > maxLength * 0.9 ? '#ef4444' : '#64748b',
            }}
          >
            {charCount}/{maxLength}
          </motion.span>
        )}
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Animated Select / Dropdown
 */
interface AnimatedSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export function AnimatedSelect({
  label,
  error,
  options,
  className = '',
  ...props
}: AnimatedSelectProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <motion.label className="block text-sm font-medium mb-2 text-slate-300" animate={{ y: isFocused ? -4 : 0 }}>
          {label}
        </motion.label>
      )}

      <motion.div
        className="relative"
        animate={{
          scale: isFocused ? 1.01 : 1,
        }}
      >
        <select
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full px-4 py-2.5 rounded-lg appearance-none
            bg-slate-900/50 border-2 transition-all duration-200
            focus:outline-none focus:ring-2
            ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/30' : 'border-slate-700 focus:border-sky-500 focus:ring-sky-500/30'}
            text-slate-200 cursor-pointer
            ${className}
          `}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Chevron icon */}
        <motion.svg
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isFocused ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </motion.svg>
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Error Shake Animation
 * Pour secouer un formulaire en cas d'erreur
 */
export function useFormShake() {
  const [shake, setShake] = React.useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.6 },
    },
  };

  return { shake, triggerShake, shakeVariants };
}

/**
 * Animated Form Container
 */
interface AnimatedFormProps {
  children: React.ReactNode;
  shake?: boolean;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export function AnimatedForm({ children, shake = false, onSubmit, className = '' }: AnimatedFormProps) {
  return (
    <motion.form
      animate={shake ? { x: [0, -5, 5, -5, 5, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={onSubmit}
      className={className}
    >
      {children}
    </motion.form>
  );
}

/**
 * Animated Form Field Group
 */
interface AnimatedFieldGroupProps {
  children: React.ReactNode;
  delay?: number;
}

export function AnimatedFieldGroup({ children, delay = 0 }: AnimatedFieldGroupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="mb-4"
    >
      {children}
    </motion.div>
  );
}
