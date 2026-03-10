/**
 * Motion Hooks - Utilitaires pour animations programmatiques
 */

import { useEffect, useState } from 'react';
import { MOTION_TIMINGS, EASING_CURVES, SPRING_PRESETS } from '@/constants/motionTimings';

/**
 * Hook pour détecter prefers-reduced-motion
 */
export function useMotionSafe() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Vérifier prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return {
    // L'utilisateur préfère moins de mouvement
    shouldReduceMotion: prefersReducedMotion,

    // Retourner une durée adaptée
    getDuration: (duration: keyof typeof MOTION_TIMINGS) => {
      return prefersReducedMotion ? '0ms' : MOTION_TIMINGS[duration];
    },

    // Retourner une courbe d'accélération adaptée
    getEasing: (easing: keyof typeof EASING_CURVES) => {
      return prefersReducedMotion ? 'linear' : EASING_CURVES[easing];
    },
  };
}

/**
 * Hook pour animations complexes
 */
export function useComplexAnimation(animationName: string, duration: keyof typeof MOTION_TIMINGS) {
  const { shouldReduceMotion, getDuration } = useMotionSafe();

  return {
    animation: shouldReduceMotion ? 'none' : `${animationName} ${getDuration(duration)} var(--easing)`,
    willChange: 'transform, opacity',
  };
}

/**
 * Hook pour stagger animations
 */
export function useStaggerAnimation(index: number, delayUnit: number = 50) {
  const { shouldReduceMotion } = useMotionSafe();

  return {
    animationDelay: shouldReduceMotion ? '0ms' : `${index * delayUnit}ms`,
  };
}

/**
 * Hook pour gérer les états d'animation
 */
export function useAnimationState(isVisible: boolean) {
  return {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  };
}

/**
 * Hook pour hover animations
 */
export function useHoverAnimation() {
  return {
    whileHover: {
      scale: 1.03,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
    whileTap: {
      scale: 0.98,
      transition: {
        duration: 0.15,
        ease: 'easeInOut',
      },
    },
  };
}

/**
 * Hook pour spring animations
 */
export function useSpring(preset: keyof typeof SPRING_PRESETS = 'default') {
  const config = SPRING_PRESETS[preset];

  return {
    transition: {
      type: 'spring',
      duration: parseInt(config.duration),
      ease: config.easing,
    },
  };
}
