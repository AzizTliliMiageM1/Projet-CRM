"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface AnimatedSidebarNavProps {
  isAdmin: boolean;
  items?: Array<{
    href: string;
    label: string;
    icon?: React.ReactNode;
    adminOnly?: boolean;
    submenu?: Array<{ href: string; label: string }>;
  }>;
}

const defaultNavItems = [
  { href: "/dashboard", label: "Dashboard" },
];

export function AnimatedSidebarNav({ isAdmin, items = defaultNavItems }: AnimatedSidebarNavProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleSubmenu = (href: string) => {
    setExpandedItems((prev) =>
      prev.includes(href) ? prev.filter((x) => x !== href) : [...prev, href]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.nav
      className="space-y-0.5 text-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item) => {
        if (item.adminOnly && !isAdmin) return null;

        const isActive = pathname.startsWith(item.href);
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isExpanded = expandedItems.includes(item.href);

        return (
          <motion.div key={item.href} variants={itemVariants}>
            <Link
              href={item.href}
              onClick={(e) => {
                if (hasSubmenu) {
                  e.preventDefault();
                  toggleSubmenu(item.href);
                }
              }}
              className={`
                relative flex items-center justify-between rounded-lg px-3 py-2.5 
                transition-all duration-200 group
                ${isActive ? 'text-sky-300' : 'text-slate-300 hover:text-slate-50'}
              `}
            >
              {/* Active indicator line */}
              {isActive && (
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-sky-400 to-sky-500 rounded-r"
                  layoutId="sidebarIndicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              {/* Background glow on hover */}
              <motion.div
                className="absolute inset-0 bg-sky-500/0 rounded-lg"
                whileHover={{ backgroundColor: 'rgba(14, 165, 233, 0.1)' }}
                transition={{ duration: 0.2 }}
              />

              {/* Content */}
              <div className="relative flex items-center gap-2 flex-1">
                {item.icon && (
                  <motion.span
                    className="w-4 h-4 flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    {item.icon}
                  </motion.span>
                )}
                <span className="truncate font-medium">{item.label}</span>
              </div>

              {/* Submenu chevron */}
              {hasSubmenu && (
                <motion.span
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative flex-shrink-0"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.span>
              )}
            </Link>

            {/* Submenu items */}
            {hasSubmenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{
                  opacity: isExpanded ? 1 : 0,
                  height: isExpanded ? 'auto' : 0,
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <motion.div
                  className="pl-6 space-y-1 mt-1"
                  variants={containerVariants}
                  initial="hidden"
                  animate={isExpanded ? 'visible' : 'hidden'}
                >
                  {item.submenu!.map((subitem) => (
                    <motion.div key={subitem.href} variants={itemVariants}>
                      <Link
                        href={subitem.href}
                        className={`
                          flex items-center rounded-md px-2 py-1.5
                          transition-colors duration-150 text-xs
                          ${pathname === subitem.href
                            ? 'bg-sky-500/10 text-sky-300'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                          }
                        `}
                      >
                        <span className="truncate">{subitem.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </motion.nav>
  );
}
