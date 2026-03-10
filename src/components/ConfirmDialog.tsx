'use client';

import React, { memo, useCallback } from 'react';
import { AlertCircle, Trash2, CheckCircle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  icon?: React.ReactNode;
}

/**
 * Reusable confirmation dialog component
 * Used for destructive actions like delete, important state changes
 */
export const ConfirmDialog = memo(function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  isDangerous = false,
  isLoading = false,
  onConfirm,
  onCancel,
  icon,
}: ConfirmDialogProps) {
  const handleConfirm = useCallback(async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error('Confirmation error:', error);
    }
  }, [onConfirm]);

  if (!isOpen) return null;

  const bgColor = isDangerous ? 'bg-red-600/10' : 'bg-sky-600/10';
  const borderColor = isDangerous ? 'border-red-600/30' : 'border-sky-600/30';
  const buttonColor = isDangerous ? 'bg-red-600 hover:bg-red-500' : 'bg-sky-600 hover:bg-sky-500';
  const iconColor = isDangerous ? 'text-red-500' : 'text-sky-500';

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className={`w-full max-w-sm rounded-xl border ${borderColor} ${bgColor} bg-slate-900/80 backdrop-blur shadow-xl p-6 animate-in fade-in zoom-in-95 duration-200`}>
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className={`flex-shrink-0 ${iconColor}`}>
              {icon || (isDangerous ? <AlertCircle className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />)}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-slate-50">{title}</h2>
            </div>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message */}
          <p className="text-sm text-slate-300 mb-6">{message}</p>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg border border-slate-600 hover:border-slate-500 text-slate-300 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800/50"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg ${buttonColor} text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {isLoading ? 'Traitement...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

/**
 * Hook for managing confirmation dialog state
 */
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState<Partial<ConfirmDialogProps>>({});
  const [isLoading, setIsLoading] = React.useState(false);

  const openConfirm = useCallback((
    title: string,
    message: string,
    onConfirmFn: () => void | Promise<void>,
    options?: Partial<Omit<ConfirmDialogProps, 'isOpen' | 'title' | 'message' | 'onConfirm'>>
  ) => {
    setConfig({
      title,
      message,
      onConfirm: onConfirmFn,
      ...options,
    });
    setIsOpen(true);
  }, []);

  const closeConfirm = useCallback(() => {
    setIsOpen(false);
    setIsLoading(false);
  }, []);

  const handleConfirm = useCallback(async () => {
    try {
      setIsLoading(true);
      if (config.onConfirm) {
        await config.onConfirm();
      }
      closeConfirm();
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  }, [config, closeConfirm]);

  return {
    isOpen,
    config: {
      ...config,
      isOpen,
      isLoading,
      onConfirm: handleConfirm,
      onCancel: closeConfirm,
    } as ConfirmDialogProps,
    openConfirm,
    closeConfirm,
  };
}
