/**
 * Motion Timing System - Système cohérent pour toutes les animations
 * Comparable à Linear, Vercel, Stripe
 */

export const MOTION_TIMINGS = {
  // Fast feedback - micro-interactions immédiates
  fast: '120ms',
  
  // Normal interactions - transitions lisses
  normal: '200ms',
  
  // Layout transitions - changements de contenu
  layout: '300ms',
  
  // Page transitions - changements de route
  page: '400ms',
  
  // Entrance animations - apparitions complexes
  entrance: '600ms',
} as const;

/**
 * Easing Functions - Courbes d'accélération premium
 */
export const EASING_CURVES = {
  // Ease in - accélération progressive
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  
  // Ease out - décélération progressive
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  
  // Ease in-out - accélération puis décélération
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Spring-like - rebond subtil (spring physics)
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  
  // Smooth spring - ressort lisse et naturel
  smoothSpring: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  
  // Elastic - élastique premium
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  
  // Bounce - rebond doux
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  
  // Back - recul initial
  back: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
} as const;

/**
 * Spring Presets - Configurations de ressort (Framer Motion-like)
 */
export const SPRING_PRESETS = {
  // Gentle spring - ressort doux
  gentle: {
    duration: '200ms',
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  
  // Default spring - ressort standard
  default: {
    duration: '250ms',
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  
  // Snappy spring - ressort vif
  snappy: {
    duration: '180ms',
    easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
  
  // Bouncy spring - ressort à rebond
  bouncy: {
    duration: '600ms',
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

/**
 * GPU Acceleration Patterns - Optimisation performance
 */
export const GPU_PATTERNS = {
  // Transform GPU - utiliser transform plutôt que position
  transformGpu: {
    transform: 'translate3d(0, 0, 0)',
    willChange: 'transform, opacity',
  },
  
  // Opacity GPU - animation d'opacité optimisée
  opacityGpu: {
    willChange: 'opacity',
    transform: 'translateZ(0)',
  },
  
  // Position GPU - mouvement optimisé (translateY)
  positionGpu: {
    willChange: 'transform',
    transform: 'translateZ(0)',
  },
  
  // Scale GPU - scaling optimisé
  scaleGpu: {
    willChange: 'transform',
    transform: 'translateZ(0)',
  },
} as const;

/**
 * Motion-Safe Query - Pour respecter prefers-reduced-motion
 */
export const MOTION_SAFE = {
  prefersReducedMotion: '@media (prefers-reduced-motion: reduce)',
  prefersMotion: '@media (prefers-reduced-motion: no-preference)',
} as const;

/**
 * Stagger Delays - Pour animations en cascade
 */
export const STAGGER_DELAYS = {
  // Petits délais (pour listes courtes)
  stagger50: {
    delayBetweenItems: '50ms',
  },
  
  // Délais moyens (standard)
  stagger100: {
    delayBetweenItems: '100ms',
  },
  
  // Délais larges (pour effets dramatiques)
  stagger150: {
    delayBetweenItems: '150ms',
  },
  
  // Très large (pour pages complètes)
  stagger200: {
    delayBetweenItems: '200ms',
  },
} as const;

/**
 * Visual Depth Layers - Hiérarchie de profondeur
 */
export const DEPTH_LAYERS = {
  // Layer 0 - Arrière-plan
  background: {
    zIndex: 0,
    boxShadow: 'none',
  },
  
  // Layer 1 - Panneaux vitrés
  glass: {
    zIndex: 10,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  },
  
  // Layer 2 - Cartes et containers
  elevated: {
    zIndex: 20,
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
  },
  
  // Layer 3 - Éléments interactifs
  interactive: {
    zIndex: 30,
    boxShadow: '0 16px 64px rgba(0, 0, 0, 0.2)',
  },
  
  // Layer 4 - Modales et tooltips
  floating: {
    zIndex: 40,
    boxShadow: '0 20px 80px rgba(0, 0, 0, 0.25)',
  },
} as const;

export type MotionTiming = keyof typeof MOTION_TIMINGS;
export type EasingCurve = keyof typeof EASING_CURVES;
export type SpringPreset = keyof typeof SPRING_PRESETS;
export type DepthLayer = keyof typeof DEPTH_LAYERS;
