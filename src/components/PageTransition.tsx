/**
 * Page Transition Component
 * Wrapper pour animations fluides entre pages
 * Comparable à Linear, Vercel, Stripe transitions
 */

'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: ReactNode;
  /** Type de transition */
  variant?: 'fadeSlide' | 'fade' | 'slideUp' | 'scaleIn';
  /** Délai avant de commencer l'animation */
  delay?: number;
  /** Stagger les enfants */
  staggerChildren?: boolean;
}

/**
 * Stagger container pour enfants
 */
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

/**
 * Stagger item pour enfants
 */
const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

export function PageTransition({
  children,
  variant = 'fadeSlide',
  delay = 0,
  staggerChildren = false,
}: PageTransitionProps) {
  const getVariant = () => {
    switch (variant) {
      case 'fadeSlide':
        return {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -12 },
          transition: { duration: 0.4, delay },
        };
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.3, delay },
        };
      case 'slideUp':
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 20 },
          transition: { duration: 0.4, delay },
        };
      case 'scaleIn':
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 },
          transition: { duration: 0.3, delay },
        };
      default:
        return {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -12 },
          transition: { duration: 0.4, delay },
        };
    }
  };

  const variantConfig = getVariant();

  return (
    <motion.div
      initial={variantConfig.initial}
      animate={variantConfig.animate}
      exit={variantConfig.exit}
      transition={variantConfig.transition}
    >
      {staggerChildren ? (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Appliquer stagger aux enfants directs */}
          {Array.isArray(children)
            ? children.map((child, i) => (
                <motion.div key={i} variants={staggerItem}>
                  {child}
                </motion.div>
              ))
            : children}
        </motion.div>
      ) : (
        children
      )}
    </motion.div>
  );
}

/**
 * Page Layout Transition - Pour usage dans layouts
 * Combine page + stagger children
 */
export function PageLayoutTransition({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PageTransition variant="fadeSlide" staggerChildren>
      {children}
    </PageTransition>
  );
}

/**
 * Dashboard Transition - Variante spécifique pour dashboard
 * Combine fade + stagger rapide
 */
export function DashboardTransition({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.3,
      }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/**
 * Component Entrance Animation - Pour entrées de composants
 */
export function ComponentEntrance({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
