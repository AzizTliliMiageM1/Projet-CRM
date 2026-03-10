import React, { useState } from "react";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
}

const positionStyles = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2 -translate-y-1",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2 translate-y-1",
  left: "right-full top-1/2 -translate-y-1/2 mr-2 -translate-x-1",
  right: "left-full top-1/2 -translate-y-1/2 ml-2 translate-x-1",
};

const arrowStyles = {
  top: "bottom-[-4px] left-1/2 -translate-x-1/2 border-t-8 border-l-4 border-r-4 border-t-slate-900/95 border-l-transparent border-r-transparent",
  bottom: "top-[-4px] left-1/2 -translate-x-1/2 border-b-8 border-l-4 border-r-4 border-b-slate-900/95 border-l-transparent border-r-transparent",
  left: "left-[-4px] top-1/2 -translate-y-1/2 border-l-8 border-t-4 border-b-4 border-l-slate-900/95 border-t-transparent border-b-transparent",
  right: "right-[-4px] top-1/2 -translate-y-1/2 border-r-8 border-t-4 border-b-4 border-r-slate-900/95 border-t-transparent border-b-transparent",
};

export function Tooltip({
  children,
  content,
  position = "top",
  delay = 300,
  className = "",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeout, setTimeoutId] = useState<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(timeoutId);
  };

  const handleMouseLeave = () => {
    if (timeout) clearTimeout(timeout);
    setIsVisible(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && (
        <div
          className={`
            absolute z-50 pointer-events-none
            ${positionStyles[position]}
            animate-fade-in-up
          `}
        >
          <div
            className={`
              px-3 py-2 bg-slate-900/95 border border-slate-700/50 rounded-lg
              text-xs font-medium text-slate-200 whitespace-nowrap
              shadow-lg shadow-slate-900/50
              ${className}
            `}
          >
            {content}
            <div className={`absolute ${arrowStyles[position]}`}></div>
          </div>
        </div>
      )}
    </div>
  );
}

interface PopoverProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: TooltipPosition;
  trigger?: "hover" | "click";
  className?: string;
}

export function Popover({
  children,
  content,
  position = "bottom",
  trigger = "click",
  className = "",
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onClick={() => trigger === "click" && setIsOpen(!isOpen)}
        onMouseEnter={() => trigger === "hover" && setIsOpen(true)}
        onMouseLeave={() => trigger === "hover" && setIsOpen(false)}
      >
        {children}
      </div>

      {isOpen && (
        <div
          className={`
            absolute z-50 ${positionStyles[position]}
            animate-fade-in-up
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`
              bg-slate-900/95 border border-slate-700/50 rounded-xl
              shadow-xl shadow-slate-900/50 backdrop-blur-sm
              ${className}
            `}
          >
            {content}
          </div>
        </div>
      )}
    </div>
  );
}

interface HoverCardProps {
  children: React.ReactNode;
  content: React.ReactNode;
  delay?: number;
}

export function HoverCard({ children, content, delay = 500 }: HoverCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeout, setTimeoutId] = useState<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(timeoutId);
  };

  const handleMouseLeave = () => {
    if (timeout) clearTimeout(timeout);
    setIsVisible(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isVisible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 animate-fade-in-up pointer-events-none">
          <div className="bg-slate-900/95 border border-slate-700/50 rounded-xl px-4 py-3 shadow-xl shadow-slate-900/50 max-w-xs">
            {content}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 h-2 w-2 bg-slate-900/95 rotate-45 border-r border-b border-slate-700/50"></div>
        </div>
      )}
    </div>
  );
}
