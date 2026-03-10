import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

export function Container({ size = "lg", className = "", children, ...props }: ContainerProps) {
  const sizeStyles = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-full",
  };

  return (
    <div
      className={`
        mx-auto px-4 sm:px-6 lg:px-8
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function PageHeader({
  title,
  description,
  icon,
  action,
  breadcrumbs,
}: PageHeaderProps) {
  return (
    <div className="mb-8 fade-in-up">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-slate-300 transition-colors">
                  {crumb.label}
                </a>
              ) : (
                <span className="text-slate-300">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500/80 to-blue-600/80 flex items-center justify-center shadow-lg shadow-sky-500/20">
              <div className="text-2xl">{icon}</div>
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-50 to-slate-200 bg-clip-text text-transparent">
              {title}
            </h1>
            {description && (
              <p className="text-slate-400 mt-2 max-w-2xl">{description}</p>
            )}
          </div>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  className?: string;
}

export function Section({ title, description, children, className = "", ...props }: SectionProps) {
  return (
    <section className={`mb-12 ${className}`} {...props}>
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-2xl font-bold text-slate-50">{title}</h2>}
          {description && <p className="text-slate-400 mt-2">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
  gap?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function Grid({ cols = 3, gap = "md", children, className = "", ...props }: GridProps) {
  const colStyles = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  };

  const gapStyles = {
    xs: "gap-3",
    sm: "gap-4",
    md: "gap-6",
    lg: "gap-8",
  };

  return (
    <div
      className={`
        grid
        ${colStyles[cols]}
        ${gapStyles[gap]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

interface DividerProps {
  withText?: string;
}

export function Divider({ withText }: DividerProps) {
  if (!withText) {
    return <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-8" />;
  }

  return (
    <div className="flex items-center gap-4 my-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      <span className="text-xs font-semibold text-slate-500 uppercase px-4">{withText}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
    </div>
  );
}
