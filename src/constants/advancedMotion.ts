/**
 * Advanced Motion Architecture
 * Expert-level spring physics + GPU acceleration + cubic-bezier easing
 * Inspiré par Linear, Vercel, Stripe motion language
 */

import { Transition } from 'framer-motion';

// ============================================================================
// Spring Physics Presets (Advanced)
// ============================================================================

export const SPRING_PHYSICS = {
  // Ultra-smooth, subtle spring (best for most interactions)
  smooth: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 40,
    mass: 1.2,
  } satisfies Transition,
  
  // Snappy, responsive spring (for buttons, toggles)
  snappy: {
    type: 'spring' as const,
    stiffness: 600,
    damping: 25,
    mass: 0.8,
  } satisfies Transition,

  // Bouncy, playful spring (for playful elements)
  bouncy: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 15,
    mass: 1.0,
  } satisfies Transition,

  // Elastic, slow spring (for panel transitions)
  elastic: {
    type: 'spring' as const,
    stiffness: 200,
    damping: 30,
    mass: 1.5,
  } satisfies Transition,

  // Stiff spring (for precise, quick interactions)
  stiff: {
    type: 'spring' as const,
    stiffness: 800,
    damping: 35,
    mass: 0.5,
  } satisfies Transition,
};

// ============================================================================
// Advanced Cubic-Bezier Easing Curves
// ============================================================================

export const EASING_CURVES = {
  // Linear - no acceleration
  linear: 'linear',

  // InOut easing curves (smooth entrance + exit)
  easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
  easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
  easeInOutQuint: 'cubic-bezier(0.86, 0, 0.07, 1)',

  // Out easing curves (deceleration)
  easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  easeOutQuint: 'cubic-bezier(0.23, 1, 0.320, 1)',
  easeOutExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
  easeOutCirc: 'cubic-bezier(0, 0.55, 0.45, 1)',
  easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  easeOutElastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',

  // In easing curves (acceleration)
  easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeInQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  easeInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
  easeInExpo: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
  easeInCirc: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
  easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',

  // Custom premium curves (inspired by Stripe/Linear)
  stripeSmooth: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  linearSmooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  premiumHover: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
};

// ============================================================================
// Motion Timing Constants (Advanced)
// ============================================================================

export const MOTION_TIMING = {
  // Micro interactions (very fast)
  instant: 50,
  micro: 100,
  
  // Standard interactions
  fast: 150,
  normal: 250,
  smooth: 350,
  
  // Slower transitions
  slow: 500,
  verySlow: 750,
  
  // Page transitions (slow)
  pageTransition: 400,
  layoutShift: 300,
  
  // Hover effects
  hoverEnter: 200,
  hoverExit: 150,
  
  // Drawer/Modal transitions
  drawerOpen: 300,
  drawerClose: 200,
};

// ============================================================================
// GPU Acceleration Utilities
// ============================================================================

export const GPU_ACCELERATION = {
  // Use for any animated element
  enabled: {
    transform: 'translateZ(0)',
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden',
    perspective: 1000,
  },

  // Use for 3D parallax effects
  parallax3D: {
    transform: 'translate3d(0, 0, 0)',
    willChange: 'transform',
    backfaceVisibility: 'hidden',
    perspective: 1200,
  },

  // Use for opacity changes only
  opacityOnly: {
    willChange: 'opacity',
  },

  // Use for transform + opacity
  transformOpacity: {
    willChange: 'transform, opacity',
  },
};

// ============================================================================
// Framer Motion Variants Library
// ============================================================================

export const MOTION_VARIANTS = {
  // Fade variants
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },

  // Slide variants
  slideUp: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  },

  slideDown: {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  },

  slideLeft: {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  },

  slideRight: {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: 20, opacity: 0 },
  },

  // Scale variants
  scaleIn: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },

  scaleUp: {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
  },

  // Rotate variants
  rotateIn: {
    hidden: { rotate: -10, opacity: 0 },
    visible: { rotate: 0, opacity: 1 },
    exit: { rotate: 10, opacity: 0 },
  },

  // Premium blur variants
  blurIn: {
    hidden: { filter: 'blur(10px)', opacity: 0 },
    visible: { filter: 'blur(0px)', opacity: 1 },
    exit: { filter: 'blur(10px)', opacity: 0 },
  },

  // Stagger container
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  },

  // Stagger child
  staggerItem: {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  },
};

// ============================================================================
// Advanced Transition Configs
// ============================================================================

export const TRANSITIONS = {
  // Smooth spring transition
  spring: {
    type: 'spring',
    stiffness: 400,
    damping: 40,
    duration: 0.5,
  },

  // Snappy spring
  snappy: {
    type: 'spring',
    stiffness: 600,
    damping: 25,
  },

  // Tween with easing
  eased: (duration = 0.3) => ({
    type: 'tween',
    duration,
    ease: 'easeInOutCubic',
  }),

  // Custom bezier
  bezier: (curve: string, duration = 0.3) => ({
    type: 'tween',
    duration,
    ease: curve,
  }),
};

// ============================================================================
// Hover Effect Presets
// ============================================================================

export const HOVER_EFFECTS = {
  // Subtle scale
  scaleSubtle: {
    scale: 1.02,
    transition: SPRING_PHYSICS.smooth,
  },

  // Medium scale
  scaleMedium: {
    scale: 1.04,
    transition: SPRING_PHYSICS.smooth,
  },

  // Lift (scale + y translate)
  lift: {
    scale: 1.02,
    y: -4,
    transition: SPRING_PHYSICS.smooth,
  },

  // Glow (shadow)
  glow: {
    boxShadow: '0 20px 25px -5px rgba(14, 165, 233, 0.3)',
    transition: SPRING_PHYSICS.smooth,
  },

  // Brightness
  brighten: {
    filter: 'brightness(1.1)',
    transition: SPRING_PHYSICS.smooth,
  },

  // Combined: lift + glow
  liftGlow: {
    scale: 1.02,
    y: -4,
    boxShadow: '0 20px 25px -5px rgba(14, 165, 233, 0.3)',
    transition: SPRING_PHYSICS.smooth,
  },
};

// ============================================================================
// Tap/Press Feedback Presets
// ============================================================================

export const TAP_FEEDBACK = {
  // Compress on tap
  compress: {
    scale: 0.98,
    transition: { type: 'spring', stiffness: 500, damping: 20 },
  },

  // Pulse on tap
  pulse: {
    scale: [1, 0.95, 1],
    transition: { duration: 0.3 },
  },

  // Rotate on tap
  rotate: {
    rotate: 2,
    transition: { type: 'spring', stiffness: 500, damping: 25 },
  },
};

// ============================================================================
// Stagger Animation Configs
// ============================================================================

export const STAGGER_CONFIGS = {
  // Tight stagger (fast cascade)
  tight: {
    staggerChildren: 0.03,
  },

  // Normal stagger
  normal: {
    staggerChildren: 0.05,
  },

  // Loose stagger (slow cascade)
  loose: {
    staggerChildren: 0.1,
  },

  // Very loose (very slow cascade)
  veryLoose: {
    staggerChildren: 0.15,
  },
};

// ============================================================================
// Parallax Configurations
// ============================================================================

export const PARALLAX_CONFIGS = {
  // Subtle parallax (2D)
  subtle: (yValue = -10) => ({
    whileHover: { y: yValue },
    transition: SPRING_PHYSICS.smooth,
  }),

  // Medium parallax (2D)
  medium: (yValue = -20) => ({
    whileHover: { y: yValue },
    transition: SPRING_PHYSICS.smooth,
  }),

  // Deep parallax (3D)
  deep: {
    style: {
      transformStyle: 'preserve-3d',
      willChange: 'transform',
    },
    whileHover: {
      rotateX: 5,
      rotateY: 5,
      z: 50,
    },
    transition: SPRING_PHYSICS.smooth,
  },
};

// ============================================================================
// Export Default Motion System
// ============================================================================

export const MOTION_SYSTEM = {
  SPRING_PHYSICS,
  EASING_CURVES,
  MOTION_TIMING,
  GPU_ACCELERATION,
  MOTION_VARIANTS,
  TRANSITIONS,
  HOVER_EFFECTS,
  TAP_FEEDBACK,
  STAGGER_CONFIGS,
  PARALLAX_CONFIGS,
};
