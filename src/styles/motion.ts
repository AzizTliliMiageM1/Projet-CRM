/**
 * Premium Motion Design System
 * Timing, easing, and transition configurations for SaaS interface
 * Comparable to Linear, Vercel, Stripe motion design
 */

// ===== MOTION TIMING =====
export const MOTION_TIMING = {
  // Micro interactions (subtle feedback)
  xs: 60,
  
  // Fast interactions (feedback, hover)
  sm: 120,
  
  // Normal interactions (standard transitions)
  md: 200,
  
  // Layout transitions (expansion, modal)
  lg: 300,
  
  // Page transitions (major layout changes)
  xl: 400,
  
  // Slow animations (parallax, scroll-triggered)
  xxl: 600,
} as const;

// ===== EASING CURVES (cubic-bezier format) =====
export const EASING = {
  // Linear - no acceleration
  linear: "cubic-bezier(0, 0, 1, 1)",
  
  // Out curves - deceleration (most natural)
  easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  easeOutSlow: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  easeOutQuad: "cubic-bezier(0.25, 0.46, 0.45, 1)",
  easeOutCubic: "cubic-bezier(0.215, 0.61, 0.355, 1)",
  easeOutQuart: "cubic-bezier(0.165, 0.84, 0.44, 1)",
  easeOutQuint: "cubic-bezier(0.23, 1, 0.32, 1)",
  
  // In curves - acceleration (use sparingly)
  easeIn: "cubic-bezier(0.4, 0, 0.84, 0.16)",
  easeInQuad: "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
  easeInCubic: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
  
  // InOut curves - smooth acceleration + deceleration
  easeInOut: "cubic-bezier(0.42, 0, 0.58, 1)",
  easeInOutQuad: "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
  easeInOutCubic: "cubic-bezier(0.645, 0.045, 0.355, 1)",
  
  // Spring-like animations (bounce effect)
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  springOut: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  springMedium: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  
  // Back curves (overshoot effect)
  backOut: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  backInOut: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  
  // Bounce
  bounceOut: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  
  // Material Design curves
  materialStandard: "cubic-bezier(0.4, 0, 0.2, 1)",
  materialDecelerate: "cubic-bezier(0, 0, 0.2, 1)",
  materialAccelerate: "cubic-bezier(0.4, 0, 1, 1)",
  materialSharp: "cubic-bezier(0.4, 0, 0.6, 1)",
} as const;

// ===== TRANSITION PRESETS =====
export const TRANSITIONS = {
  // Standard transitions
  default: `all 200ms cubic-bezier(0.16, 1, 0.3, 1)`,
  fast: `all 120ms cubic-bezier(0.16, 1, 0.3, 1)`,
  smooth: `all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
  slowSmoooth: `all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
  
  // Specific property transitions
  colors: `background-color 200ms ease-out, color 200ms ease-out, border-color 200ms ease-out`,
  transform: `transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
  shadow: `box-shadow 200ms ease-out`,
  opacity: `opacity 200ms ease-out`,
  
  // Complex transitions
  hover: `all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
  elevation: `transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 300ms ease-out`,
  scale: `transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
} as const;

// ===== ANIMATION MAPPINGS FOR CSS =====
export const ANIMATION_MAP = {
  timings: `
    --motion-xs: ${MOTION_TIMING.xs}ms;
    --motion-sm: ${MOTION_TIMING.sm}ms;
    --motion-md: ${MOTION_TIMING.md}ms;
    --motion-lg: ${MOTION_TIMING.lg}ms;
    --motion-xl: ${MOTION_TIMING.xl}ms;
    --motion-xxl: ${MOTION_TIMING.xxl}ms;
  `,
  
  easings: `
    --ease-out: ${EASING.easeOut};
    --ease-in: ${EASING.easeIn};
    --ease-in-out: ${EASING.easeInOut};
    --ease-spring: ${EASING.spring};
    --ease-bounce: ${EASING.bounceOut};
    --ease-back: ${EASING.backOut};
  `,
} as const;

// ===== TRANSFORM PRESETS =====
export const TRANSFORMS = {
  hover: {
    scale: "scale(1.02)",
    scaleSmall: "scale(1.01)",
    scaleLarge: "scale(1.05)",
    liftSmall: "translateY(-2px)",
    liftMedium: "translateY(-4px)",
    liftLarge: "translateY(-8px)",
  },
  active: {
    scale: "scale(0.98)",
    lift: "translateY(-1px)",
  },
  disabled: {
    opacity: "0.5",
  },
} as const;

// ===== TAILWIND CSS CLASSES GENERATOR =====
export const motionClasses = {
  // Hover effects
  hoverLiftSmall: "hover:translate-y-[-2px] transition-transform",
  hoverLiftMedium: "hover:translate-y-[-4px] hover:shadow-lg transition-all",
  hoverLiftLarge: "hover:translate-y-[-8px] hover:shadow-2xl transition-all",
  hoverScale: "hover:scale-105 transition-transform",
  hoverScaleSmall: "hover:scale-102 transition-transform",
  hoverGlowBlue: "hover:shadow-lg hover:shadow-blue-500/50 transition-shadow",
  hoverGlowSky: "hover:shadow-lg hover:shadow-sky-500/50 transition-shadow",
  hoverGlowEmerald: "hover:shadow-lg hover:shadow-emerald-500/50 transition-shadow",
  
  // Press effects
  activeScale: "active:scale-95 transition-transform",
  activeOpacity: "active:opacity-75 transition-opacity",
  
  // Focus effects
  focusGlow: "focus:ring-3 focus:ring-sky-500/50 focus:shadow-lg focus:shadow-sky-500/30 transition-all",
  focusGlowMuted: "focus:ring-2 focus:ring-slate-400/50 transition-all",
  
  // Smooth transitions
  smoothTransition: "transition-all duration-200",
  smoothFast: "transition-all duration-100",
  smoothSlow: "transition-all duration-300",
  
  // Disabled states
  disabled: "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
  
  // Animation utilities
  animatePulse: "animate-pulse",
  animateFloat: "animate-float",
  animateFadeIn: "animate-fade-in",
  animateFadeInUp: "animate-fade-in-up",
  animateSlideInRight: "animate-slide-in-right",
  animateScaleIn: "animate-scale-in",
} as const;

// ===== PREFERS REDUCED MOTION =====
export const prefersReducedMotion = `
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

// ===== GPU ACCELERATION =====
export const gpuAcceleration = `
  will-change: transform;
  transform: translateZ(0);
  perspective: 1000px;
`;

// ===== HELPER FUNCTIONS =====
export function createTransition(duration: number, easing: string, properties = "all") {
  return `${properties} ${duration}ms ${easing}`;
}

export function createAnimation(name: string, duration: number, easing: string, delay = 0) {
  const delayStr = delay > 0 ? ` ${delay}ms` : "";
  return `${name} ${duration}ms ${easing}${delayStr}`;
}

export function getMotionValue(timing: keyof typeof MOTION_TIMING) {
  return `${MOTION_TIMING[timing]}ms`;
}

export function getEasingValue(easing: keyof typeof EASING) {
  return EASING[easing];
}
