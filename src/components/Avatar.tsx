/**
 * Génère les initiales à partir d'un nom
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Génère un gradient déterministe à partir d'une string
 */
export function getGradientFromString(str: string): string {
  const gradients = [
    "from-sky-400 to-blue-600",
    "from-purple-400 to-indigo-600",
    "from-pink-400 to-rose-600",
    "from-red-400 to-orange-600",
    "from-orange-400 to-amber-600",
    "from-green-400 to-emerald-600",
    "from-teal-400 to-cyan-600",
    "from-blue-400 to-purple-600",
    "from-violet-400 to-fuchsia-600",
    "from-fuchsia-400 to-pink-600",
  ];

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return gradients[Math.abs(hash) % gradients.length];
}

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showAnimation?: boolean;
  /** Afficher pulse d'animation au hover */
  enablePulse?: boolean;
  /** Afficher effet parallax 3D */
  enableParallax?: boolean;
}

export function Avatar({
  name,
  size = "md",
  className = "",
  showAnimation = true,
  enablePulse = true,
  enableParallax = true,
}: AvatarProps) {
  const initials = getInitials(name);
  const gradient = getGradientFromString(name);

  const sizeClass = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
  }[size];

  // Style pour parallax 3D hover
  const parallaxStyle = {
    perspective: "1000px",
    transformStyle: "preserve-3d" as const,
  };

  return (
    <div
      style={enableParallax ? parallaxStyle : undefined}
      className={`
        inline-block
        group
        ${enableParallax ? "transition-all duration-300" : ""}
        ${className}
      `}
      title={name}
    >
      <div
        className={`
          ${sizeClass}
          bg-gradient-to-br ${gradient}
          rounded-full flex items-center justify-center 
          font-semibold text-white flex-shrink-0
          shadow-md shadow-slate-900/30
          transition-all duration-300 ease-out
          hover:shadow-lg hover:scale-105
          ring-2 ring-slate-900/20
          ${showAnimation ? "hover:ring-sky-400/50" : ""}
          ${enablePulse ? "group-hover:animate-softPulse" : ""}
          ${enableParallax ? "group-hover:shadow-xl group-hover:shadow-sky-400/30" : ""}
          will-change-transform
        `}
        style={
          enableParallax
            ? {
                transform: "translateZ(16px)",
                backfaceVisibility: "hidden",
              }
            : undefined
        }
      >
        {initials}
      </div>

      {/* Soft glow effect - uniquement à l'affichage */}
      {showAnimation && (
        <div
          className={`
            absolute inset-0 rounded-full blur-lg opacity-0
            group-hover:opacity-100 transition-opacity duration-300
            pointer-events-none
            ${gradient === "from-sky-400 to-blue-600" ? "bg-blue-400" : ""}
            ${gradient === "from-purple-400 to-indigo-600" ? "bg-indigo-400" : ""}
            ${gradient === "from-pink-400 to-rose-600" ? "bg-rose-400" : ""}
            ${gradient === "from-red-400 to-orange-600" ? "bg-orange-400" : ""}
            ${gradient === "from-orange-400 to-amber-600" ? "bg-amber-400" : ""}
            ${gradient === "from-green-400 to-emerald-600" ? "bg-emerald-400" : ""}
            ${gradient === "from-teal-400 to-cyan-600" ? "bg-cyan-400" : ""}
            ${gradient === "from-violet-400 to-fuchsia-600" ? "bg-fuchsia-400" : ""}
            ${gradient === "from-fuchsia-400 to-pink-600" ? "bg-pink-400" : ""}
          `}
        />
      )}
    </div>
  );
}
