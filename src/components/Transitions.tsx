import React, { memo } from 'react';

/**
 * Fade-in animation wrapper
 * Smooth opacity transition on mount
 */
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeIn = memo(function FadeIn({
  children,
  delay = 0,
  duration = 300,
  className = '',
}: FadeInProps) {
  return (
    <div
      className={`animate-in fade-in ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
});

/**
 * Slide-in animation wrapper
 * Useful for modals, notifications, sidebars
 */
interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
}

export const SlideIn = memo(function SlideIn({
  children,
  direction = 'right',
  delay = 0,
  duration = 300,
  className = '',
}: SlideInProps) {
  const directionClass = {
    left: 'slide-in-from-left',
    right: 'slide-in-from-right',
    up: 'slide-in-from-top',
    down: 'slide-in-from-bottom',
  }[direction];

  return (
    <div
      className={`animate-in ${directionClass} ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
});

/**
 * Zoom-in animation wrapper
 * Scale effect on appearance
 */
interface ZoomInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const ZoomIn = memo(function ZoomIn({
  children,
  delay = 0,
  duration = 300,
  className = '',
}: ZoomInProps) {
  return (
    <div
      className={`animate-in zoom-in-95 ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
});

/**
 * Staggered list item animation
 * Animates list items one after another
 */
interface StaggeredListProps {
  children: React.ReactNode[];
  delay?: number;
  duration?: number;
  staggerDelay?: number;
}

export const StaggeredList = memo(function StaggeredList({
  children,
  delay = 0,
  duration = 300,
  staggerDelay = 50,
}: StaggeredListProps) {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <FadeIn
          key={index}
          delay={delay + index * staggerDelay}
          duration={duration}
        >
          {child}
        </FadeIn>
      ))}
    </>
  );
});

/**
 * Smooth height transition wrapper
 * Useful for collapsible content
 */
interface SmoothHeightProps {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
}

export const SmoothHeight = memo(function SmoothHeight({
  children,
  isOpen,
  className = '',
}: SmoothHeightProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={`overflow-hidden transition-all duration-300 ease-in-out ${className}`}
      style={{
        maxHeight: isOpen ? ref.current?.scrollHeight : 0,
        opacity: isOpen ? 1 : 0.7,
      }}
    >
      {children}
    </div>
  );
});

/**
 * Pulse animation wrapper
 * For attention-drawing highlights
 */
interface PulseProps {
  children: React.ReactNode;
  className?: string;
}

export const Pulse = memo(function Pulse({
  children,
  className = '',
}: PulseProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {children}
    </div>
  );
});

/**
 * Bounce animation wrapper
 * For call-to-action buttons
 */
interface BounceProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const Bounce = memo(function Bounce({
  children,
  delay = 0,
  className = '',
}: BounceProps) {
  return (
    <div
      className={`animate-bounce ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
});
