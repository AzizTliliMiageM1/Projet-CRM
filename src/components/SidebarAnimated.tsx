'use client';

import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
  badge?: number;
}

/**
 * Sidebar Item with Advanced Animations
 * Animations premium pour items de sidebar
 */
export function SidebarItem({
  icon: Icon,
  label,
  href,
  isActive = false,
  onClick,
  badge,
}: SidebarItemProps) {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      className={`
        relative flex items-center gap-3 px-4 py-3 rounded-lg
        transition-all duration-300 ease-out group/item
        cursor-pointer overflow-hidden
        ${
          isActive
            ? 'bg-sky-900/30 text-sky-300'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
        }
      `}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Active indicator - animated glow border */}
      {isActive && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-400 to-sky-500"
          layoutId="sidebarIndicator"
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
        />
      )}

      {/* Gradient hover sweep */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: isActive ? 'none' : 'linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)',
        }}
      />

      {/* Glow effect - active only */}
      {isActive && (
        <motion.div
          className="absolute inset-0 from-sky-400/20 to-transparent pointer-events-none opacity-0 group-hover/item:opacity-100"
          animate={{
            boxShadow: ['0 0 0 0 rgba(56, 189, 248, 0.4)', '0 0 0 8px rgba(56, 189, 248, 0)'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      )}

      {/* Icon with animations */}
      <motion.div
        className={`
          flex-shrink-0 transition-all duration-300
          ${isActive ? 'text-sky-400' : 'group-hover/item:text-sky-300'}
        `}
        initial={false}
        animate={isActive ? { scale: 1.1 } : { scale: 1 }}
        whileHover={{ rotate: 5 }}
      >
        <Icon className="w-5 h-5" />
      </motion.div>

      {/* Label with slide animation */}
      <motion.span
        className="flex-1 text-sm font-medium"
        initial={false}
        animate={isActive ? { x: 2 } : { x: 0 }}
        transition={{ duration: 0.2 }}
      >
        {label}
      </motion.span>

      {/* Badge animation */}
      {badge && (
        <motion.div
          className={`
            flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold
            ${isActive ? 'bg-sky-500/30 text-sky-300' : 'bg-slate-700 text-slate-300'}
          `}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 17,
          }}
        >
          {badge}
        </motion.div>
      )}
    </motion.a>
  );
}

/**
 * Sidebar Section
 */
interface SidebarSectionProps {
  title: string;
  children: ReactNode;
  collapsible?: boolean;
}

export function SidebarSection({ title, children, collapsible = false }: SidebarSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div className="mb-8">
      {/* Section Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full px-4 py-2 group/header"
      >
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest group-hover/header:text-slate-400 transition-colors">
          {title}
        </span>

        {collapsible && (
          <motion.svg
            className="w-4 h-4 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isExpanded ? 0 : -90 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </motion.svg>
        )}
      </motion.button>

      {/* Section Items - with collapse animation  */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="space-y-1 mt-2">{children}</div>
      </motion.div>
    </div>
  );
}

/**
 * Sidebar - Main Component
 */
interface SidebarProps {
  items: Array<{
    section: string;
    items: SidebarItemProps[];
  }>;
  activeItem?: string;
  onItemClick?: (label: string) => void;
  collapsed?: boolean;
}

export function Sidebar({ items, activeItem, onItemClick, collapsed = false }: SidebarProps) {
  return (
    <motion.aside
      className={`
        flex flex-col h-screen bg-gradient-to-b from-slate-900/50 to-slate-950
        border-r border-slate-800/50 backdrop-blur-sm
        transition-all duration-500 ease-out
        ${collapsed ? 'w-20' : 'w-64'}
      `}
      animate={{
        width: collapsed ? 80 : 256,
      }}
    >
      {/* Sidebar content */}
      <motion.div
        className="flex-1 overflow-y-auto px-3 py-6 space-y-2"
        animate={{
          opacity: collapsed ? 0.5 : 1,
        }}
      >
        {items.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            {collapsed ? (
              // Collapsed view - only icons
              <div className="space-y-2">
                {section.items.map((item) => (
                  <motion.button
                    key={item.label}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      transition-all duration-300 group/icon
                      ${item.isActive ? 'bg-sky-500/20 text-sky-400' : 'text-slate-400 hover:bg-slate-800/50'}
                    `}
                    title={item.label}
                  >
                    <item.icon className="w-5 h-5" />

                    {/* Tooltip on hover */}
                    <motion.div
                      className="fixed left-20 ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded whitespace-nowrap pointer-events-none opacity-0 group-hover/icon:opacity-100 transition-opacity"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      {item.label}
                    </motion.div>
                  </motion.button>
                ))}
              </div>
            ) : (
              // Expanded view
              <SidebarSection title={section.section}>
                {section.items.map((item) => (
                  <SidebarItem
                    key={item.label}
                    {...item}
                    isActive={activeItem === item.label}
                    onClick={() => {
                      onItemClick?.(item.label);
                      item.onClick?.();
                    }}
                  />
                ))}
              </SidebarSection>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Footer with chevron for collapse toggle */}
      <motion.div className="px-3 py-4 border-t border-slate-800/50"></motion.div>
    </motion.aside>
  );
}

/**
 * Sidebar Toggle Button
 */
interface SidebarToggleProps {
  collapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

export function SidebarToggle({ collapsed, onToggle }: SidebarToggleProps) {
  return (
    <motion.button
      onClick={() => onToggle(!collapsed)}
      className="fixed bottom-6 left-6 w-12 h-12 rounded-full bg-sky-500 text-white shadow-lg hover:shadow-xl hover:bg-sky-600 transition-all duration-300 flex items-center justify-center z-40 group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        animate={{ rotate: collapsed ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </motion.svg>
    </motion.button>
  );
}
