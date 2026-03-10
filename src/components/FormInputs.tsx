import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export function Input({ label, error, icon, helperText, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-200 mb-2">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full rounded-lg border border-slate-700/50 bg-slate-900/30 backdrop-blur-sm
            px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500
            transition-all duration-300
            focus:outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 focus:bg-slate-900/50
            hover:border-slate-600/50
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? "pl-10" : ""}
            ${error ? "border-red-500/50 focus:ring-red-500/20" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-500 mt-1.5">{helperText}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({ label, error, helperText, className = "", ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-200 mb-2">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        className={`
          w-full rounded-lg border border-slate-700/50 bg-slate-900/30 backdrop-blur-sm
          px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500
          transition-all duration-300
          focus:outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 focus:bg-slate-900/50
          hover:border-slate-600/50
          disabled:opacity-50 disabled:cursor-not-allowed
          resize-none
          ${error ? "border-red-500/50 focus:ring-red-500/20" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-500 mt-1.5">{helperText}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  options: Array<{ value: string; label: string }>;
}

export function Select({ label, error, icon, options, className = "", ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-200 mb-2">
          {label}
          {props.required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
        <select
          className={`
            w-full rounded-lg border border-slate-700/50 bg-slate-900/30 backdrop-blur-sm
            px-4 py-2.5 text-sm text-slate-100
            transition-all duration-300
            focus:outline-none focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 focus:bg-slate-900/50
            hover:border-slate-600/50
            disabled:opacity-50 disabled:cursor-not-allowed
            appearance-none cursor-pointer
            ${icon ? "pl-10" : ""}
            ${error ? "border-red-500/50 focus:ring-red-500/20" : ""}
            ${className}
          `}
          {...props}
        >
          <option value="">Sélectionnez une option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-900 text-slate-100">
              {option.label}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
      {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
    </div>
  );
}
