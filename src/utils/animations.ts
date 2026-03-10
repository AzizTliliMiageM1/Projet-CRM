/**
 * Animation Utilities
 * Helpers pour animations complexes et count-up
 */

/**
 * Count-Up Animation Helper
 * Anime un nombre de 0 à la valeur finale
 */
export function useCountUp(
  endValue: number,
  duration: number = 2000,
  startValue: number = 0
) {
  return {
    from: startValue,
    to: endValue,
    duration,
    easingFunction: easeOutCubic,
  };
}

/**
 * Easing Functions
 */
export const easeOutCubic = (t: number): number => {
  return 1 - Math.pow(1 - t, 3);
};

export const easeOutQuad = (t: number): number => {
  return t * (2 - t);
};

export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/**
 * Animate Count Hook
 * Pour animer un nombre avec React
 */
export function animateCount(
  start: number,
  end: number,
  duration: number,
  onUpdate: (value: number) => void
) {
  let currentValue = start;
  const startTime = Date.now();
  const endTime = startTime + duration;

  const animate = () => {
    const now = Date.now();
    const progress = Math.min((now - startTime) / duration, 1);

    const easeProgress = easeOutCubic(progress);
    const newValue = Math.floor(start + (end - start) * easeProgress);

    if (newValue !== currentValue) {
      currentValue = newValue;
      onUpdate(currentValue);
    }

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      onUpdate(end);
    }
  };

  animate();
}

/**
 * Stagger Animation Helper
 * Calcule les délais pour animation en cascade
 */
export function getStaggerDelay(
  index: number,
  baseDelay: number = 100,
  maxDelay: number = 500
): number {
  const calculatedDelay = index * baseDelay;
  return Math.min(calculatedDelay, maxDelay);
}

/**
 * Animation Variant Helper
 * Génère les variants pour Framer Motion
 */
export const createMotionVariants = (
  baseClass: string,
  animationName: string,
  duration: number
) => ({
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration / 1000,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: duration / 1000,
    },
  },
});

/**
 * Shimmer Animation Setup
 * Pour les loading states
 */
export const shimmerAnimation = {
  backgroundSize: '200% 100%',
  backgroundPosition: '100% 0',
  background:
    'linear-gradient(90deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.04) 100%)',
  animation: 'shimmerSweep 2s infinite',
};

/**
 * Wave Animation Setup
 * Pour les loaders
 */
export const waveAnimation = {
  display: 'inline-block',
  width: '8px',
  height: '4px',
  marginRight: '4px',
  animation: 'wave 1.2s infinite',
};

/**
 * Pulse Animation Setup
 */
export const pulseAnimation = {
  animation: 'softPulse 2s ease-in-out infinite',
};

/**
 * Hover Scale Helper
 */
export const hoverScale = (scale: number = 1.05) => ({
  transition: 'transform 0.2s ease-out',
  '&:hover': {
    transform: `scale(${scale})`,
  },
});

/**
 * Calculate Gradient Angle
 * Pour les dégradés animés
 */
export function getGradientAngle(time: number, speed: number = 0.05): number {
  return (time * speed) % 360;
}

/**
 * Format Number with K/M suffix
 * Pour les KPI cards
 */
export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
}

/**
 * Get Animation Duration by Type
 */
export function getAnimationDuration(type: 'fast' | 'normal' | 'slow' = 'normal'): number {
  const durations = {
    fast: 120,
    normal: 200,
    slow: 300,
  };
  return durations[type];
}

/**
 * Create Stagger Container Variants
 */
export function createStaggerVariants(staggerDelay: number = 100) {
  return {
    container: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay / 1000,
          delayChildren: 0.2,
        },
      },
    },
    item: {
      hidden: { opacity: 0, y: 20 },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
        },
      },
    },
  };
}
