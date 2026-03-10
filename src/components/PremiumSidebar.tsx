'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { SPRING_PHYSICS, MOTION_TIMING } from '@/constants/advancedMotion';

/**
 * Premium Sidebar Navigation
 * Expert-level micro-interactions inspired by Linear, Vercel, Stripe
 */

interface SidebarItemConfig {
  href: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  submenu?: SidebarItemConfig[];
  adminOnly?: boolean;
}

interface PremiumSidebarProps {
  items: SidebarItemConfig[];
  currentPath: string;
  isAdmin?: boolean;
  isCollapsed?: boolean;
  onNavigate?: (href: string) => void;
}

export function PremiumSidebar({
  items,
  currentPath,
  isAdmin = false,
  isCollapsed = false,
  onNavigate,
}: PremiumSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const toggleSubmenu = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((x) => x !== href) : [...prev, href]
    );
  };

  return (
    <motion.aside
      className={`
        relative flex flex-col
        bg-gradient-to-b from-slate-950 to-slate-900/80
        border-r border-slate-800/50
        backdrop-blur-md
        transition-all duration-300
        ${isCollapsed ? 'w-20' : 'w-64'}
        h-screen overflow-y-auto
      `}
      animate={{ width: isCollapsed ? 80 : 256 }}
    >
      {/* Sidebar header */}
      <div className="p-6 border-b border-slate-800/50">
        <motion.div
          className="flex items-center justify-between"
          layout
        >
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <h2 className="text-lg font-bold bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">
                CRM
              </h2>
              <p className="text-xs text-slate-500">Premium SaaS</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <motion.div
          layout
          className="space-y-0.5"
        >
          {items.map((item) => {
            if (item.adminOnly && !isAdmin) return null;
            const isActive = currentPath.startsWith(item.href);
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = expandedItems.includes(item.href);

            return (
              <div key={item.href}>
                {/* Main item */}
                <motion.button
                  className={`
                    relative w-full flex items-center justify-between
                    px-3 py-2.5 rounded-lg
                    text-sm font-medium
                    transition-all duration-200
                    group
                  `}
                  onClick={() => {
                    if (hasSubmenu) {
                      toggleSubmenu(item.href);
                    } else {
                      onNavigate?.(item.href);
                    }
                  }}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  whileHover={{ x: 2 }}
                  transition={SPRING_PHYSICS.smooth}
                >
                  {/* Active indicator background */}
                  {isActive && (
                    <motion.div
                      layoutId="activeItemBg"
                      className="absolute inset-0 bg-gradient-to-r from-sky-500/20 to-cyan-500/10 rounded-lg"
                      transition={SPRING_PHYSICS.smooth}
                    />
                  )}

                  {/* Hover background */}
                  {hoveredItem === item.href && !isActive && (
                    <motion.div
                      className="absolute inset-0 bg-slate-700/30 rounded-lg"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}

                  {/* Left border indicator (animated) */}
                  {isActive && (
                    <motion.div
                      layoutId="activeItemBorder"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-sky-400 to-cyan-400 rounded-r"
                      transition={SPRING_PHYSICS.snappy}
                    />
                  )}

                  {/* Content */}
                  <div className="relative z-10 flex items-center gap-3 flex-1">
                    {item.icon && (
                      <motion.div
                        animate={
                          isActive || hoveredItem === item.href
                            ? { scale: 1.1 }
                            : { scale: 1 }
                        }
                        transition={SPRING_PHYSICS.snappy}
                        className={`w-5 h-5 flex-shrink-0 ${
                          isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      >
                        {item.icon}
                      </motion.div>
                    )}

                    {!isCollapsed && (
                      <>
                        <span
                          className={`truncate text-left text-sm font-medium ${
                            isActive
                              ? 'text-sky-300'
                              : 'text-slate-300 group-hover:text-slate-50'
                          }`}
                        >
                          {item.label}
                        </span>

                        {item.badge && (
                          <motion.span
                            className="ml-auto px-2 py-1 rounded text-xs font-bold bg-sky-500/30 text-sky-300"
                            animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                          >
                            {item.badge}
                          </motion.span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Submenu chevron */}
                  {hasSubmenu && !isCollapsed && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={SPRING_PHYSICS.snappy}
                      className="relative z-10 text-slate-400"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.button>

                {/* Submenu items */}
                <AnimatePresence>
                  {hasSubmenu && isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={SPRING_PHYSICS.smooth}
                      className="overflow-hidden"
                    >
                      <motion.div
                        className="pl-6 space-y-1 mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.03 }}
                      >
                        {item.submenu!.map((subitem, idx) => {
                          const isSubActive = currentPath === subitem.href;
                          return (
                            <motion.button
                              key={subitem.href}
                              onClick={() => onNavigate?.(subitem.href)}
                              className={`
                                relative w-full text-left px-3 py-2 rounded text-xs font-medium
                                transition-all duration-200
                                ${
                                  isSubActive
                                    ? 'bg-sky-500/20 text-sky-300'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                }
                              `}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.03 }}
                              whileHover={{ x: 2 }}
                            >
                              {isSubActive && (
                                <motion.div
                                  layoutId="activeSubitemBg"
                                  className="absolute left-0 top-0 bottom-0 w-1 bg-sky-400 rounded-r"
                                  transition={SPRING_PHYSICS.snappy}
                                />
                              )}
                              <span className="relative z-10">{subitem.label}</span>
                            </motion.button>
                          );
                        })}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>
      </nav>

      {/* Footer section */}
      <div className="p-4 border-t border-slate-800/50 space-y-2">
        <motion.button
          className={`
            w-full px-3 py-2 rounded-lg
            text-xs font-medium text-slate-400 hover:text-slate-200
            hover:bg-slate-800/50 transition-all
            flex items-center justify-between
          `}
          whileHover={{ scale: 1.01 }}
        >
          {!isCollapsed && <span>Help</span>}
          <motion.span
            className="text-slate-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            ?
          </motion.span>
        </motion.button>

        {!isCollapsed && (
          <motion.button
            className="w-full px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all"
            whileHover={{ scale: 1.01 }}
          >
            Sign Out
          </motion.button>
        )}
      </div>
    </motion.aside>
  );
}

// ============================================================================
// Sidebar Toggle Button
// ============================================================================

interface SidebarToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function SidebarToggle({ isCollapsed, onToggle }: SidebarToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{ rotate: isCollapsed ? 180 : 0 }}
        transition={SPRING_PHYSICS.snappy}
      >
        <ChevronLeft className="w-5 h-5 text-slate-400" />
      </motion.div>
    </motion.button>
  );
}
