"use client";

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gradient definitions */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>

      {/* Main circle background */}
      <circle cx="24" cy="24" r="22" fill="url(#logoGradient)" opacity="0.15" />

      {/* Left curved shape */}
      <path
        d="M 12 24 Q 12 16 20 14 L 20 34 Q 12 32 12 24"
        fill="url(#logoGradient)"
      />

      {/* Right curved shape */}
      <path
        d="M 36 24 Q 36 16 28 14 L 28 34 Q 36 32 36 24"
        fill="url(#accentGradient)"
      />

      {/* Center connection */}
      <circle cx="24" cy="24" r="3" fill="url(#logoGradient)" />

      {/* Top accent */}
      <path
        d="M 18 18 L 30 18 Q 24 14 18 18"
        fill="url(#accentGradient)"
        opacity="0.8"
      />

      {/* Bottom accent */}
      <path
        d="M 18 30 L 30 30 Q 24 34 18 30"
        fill="url(#logoGradient)"
        opacity="0.8"
      />

      {/* Dots for data points */}
      <circle cx="16" cy="20" r="1.5" fill="url(#logoGradient)" />
      <circle cx="32" cy="20" r="1.5" fill="url(#accentGradient)" />
      <circle cx="16" cy="28" r="1.5" fill="url(#accentGradient)" />
      <circle cx="32" cy="28" r="1.5" fill="url(#logoGradient)" />
    </svg>
  );
}

export function LogoWithText({ className = "w-auto h-8" }: { className?: string }) {
  return (
    <div className="flex items-center gap-2">
      <Logo className="w-8 h-8" />
      <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
        CRM Suite
      </span>
    </div>
  );
}
