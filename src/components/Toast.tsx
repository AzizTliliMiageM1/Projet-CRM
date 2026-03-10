import React, { useEffect, useState } from "react";
import { X, Check, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const typeStyles = {
  success: {
    bg: "from-emerald-500/20 to-green-500/10",
    border: "border-emerald-500/30",
    icon: Check,
    text: "text-emerald-300",
    dot: "bg-emerald-400",
  },
  error: {
    bg: "from-red-500/20 to-rose-500/10",
    border: "border-red-500/30",
    icon: AlertCircle,
    text: "text-red-300",
    dot: "bg-red-400",
  },
  info: {
    bg: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-500/30",
    icon: Info,
    text: "text-cyan-300",
    dot: "bg-cyan-400",
  },
  warning: {
    bg: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/30",
    icon: AlertCircle,
    text: "text-amber-300",
    dot: "bg-amber-400",
  },
};

export function Toast({ message, type = "info", duration = 5000, onClose, action }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const style = typeStyles[type];
  const Icon = style.icon;

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="animate-fade-in-up">
      <div
        className={`
          flex items-start gap-3
          rounded-lg border ${style.border} 
          bg-gradient-to-r ${style.bg}
          px-4 py-3 shadow-lg
          backdrop-blur-sm
          transition-all duration-300 ease-out
          hover:shadow-xl hover:shadow-${type === "success" ? "emerald" : type === "error" ? "red" : type === "success" ? "cyan" : "amber"}-500/20
        `}
      >
        <div className="flex-shrink-0">
          <div className={`w-2 h-2 rounded-full ${style.dot} animate-pulse`}></div>
        </div>

        <div className="flex-1 flex items-start gap-3">
          <Icon className={`w-5 h-5 ${style.text} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <p className={`text-sm font-medium ${style.text}`}>{message}</p>
            {action && (
              <button
                onClick={action.onClick}
                className={`text-xs font-semibold mt-2 ${style.text} hover:opacity-80 transition-opacity`}
              >
                {action.label}
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className={`flex-shrink-0 ${style.text} hover:opacity-70 transition-opacity p-1`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>;
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={() => onRemove(toast.id)} />
        </div>
      ))}
    </div>
  );
}

// Hook pour utiliser les toasts
export function useToast() {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const addToast = (toast: Omit<ToastProps, "onClose">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    if (toast.duration !== 0) {
      setTimeout(() => removeToast(id), toast.duration || 5000);
    }

    return id;
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, addToast, removeToast };
}
