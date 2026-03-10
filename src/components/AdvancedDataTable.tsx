'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit, MoreHorizontal } from 'lucide-react';
import { SPRING_PHYSICS, MOTION_TIMING } from '@/constants/advancedMotion';

/**
 * Advanced Data Table UX
 * Row elevation, progressive background highlight, contextual action reveal
 * Inspired by Stripe, Vercel dashboards
 */

interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

interface TableAction {
  icon: React.ReactNode;
  label: string;
  onClick: (row: any) => void;
  variant?: 'default' | 'danger';
}

interface AdvancedTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  actions?: TableAction[];
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  hoverable?: boolean;
  striped?: boolean;
}

export function AdvancedDataTable<T extends { id?: string | number }>({
  columns,
  data,
  actions = [],
  onRowClick,
  selectable = false,
  hoverable = true,
  striped = true,
}: AdvancedTableProps<T>) {
  const [hoveredRowId, setHoveredRowId] = useState<string | number | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);

  const handleSelectRow = (id: string | number | undefined) => {
    if (!id) return;
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      const ids = data
        .map((row) => row.id)
        .filter((id): id is string | number => id !== undefined);
      setSelectedRows(new Set(ids));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-md"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <table className="w-full text-sm">
        {/* Header */}
        <thead>
          <tr className="border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
            {selectable && (
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows.size === data.length && data.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-slate-600 cursor-pointer"
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`
                  px-6 py-3 text-left text-xs font-semibold
                  text-slate-300 uppercase tracking-wider
                  ${column.sortable ? 'cursor-pointer hover:text-slate-100' : ''}
                  ${column.className || ''}
                `}
                onClick={() => {
                  if (column.sortable) {
                    setSortConfig((prev) => ({
                      key: column.key,
                      direction: prev?.key === column.key && prev.direction === 'asc' ? 'desc' : 'asc',
                    }));
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  {column.label}
                  {column.sortable && (
                    <motion.div animate={{ rotate: sortConfig?.key === column.key ? 180 : 0 }}>
                      ↓
                    </motion.div>
                  )}
                </div>
              </th>
            ))}
            {actions.length > 0 && <th className="px-6 py-3 text-right w-12">Actions</th>}
          </tr>
        </thead>

        {/* Body */}
        <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
          {data.map((row, idx) => {
            const rowId = row.id;
            const isHovered = hoveredRowId === rowId;
            const isSelected = selectedRows.has(rowId!);

            return (
              <motion.tr
                key={rowId}
                variants={rowVariants}
                    className={`
                      relative border-b border-slate-700/30 transition-all duration-200
                      group cursor-pointer
                      ${striped && idx % 2 === 1 ? 'bg-slate-800/20' : ''}
                    `}
                    onMouseEnter={() => setHoveredRowId(rowId ?? null)}
                    onMouseLeave={() => setHoveredRowId(null)}
                    onClick={() => onRowClick?.(row)}
                    whileHover={
                      hoverable
                        ? {
                            backgroundColor: 'rgba(15, 23, 42, 0.8)',
                            boxShadow: '0 0 20px rgba(14, 165, 233, 0.1)',
                          }
                        : {}
                    }
                    transition={SPRING_PHYSICS.smooth}
                  >
                    {/* Row elevation effect */}
                    <motion.div
                      className="absolute -inset-x-4 -inset-y-px rounded-lg bg-gradient-to-r from-sky-500/0 to-cyan-500/0 -z-10"
                      animate={
                        isHovered
                          ? {
                              background: 'linear-gradient(to right, rgba(14, 165, 233, 0.1), rgba(34, 211, 238, 0.1))',
                              boxShadow: '0 10px 30px rgba(14, 165, 233, 0.15)',
                            }
                          : {
                              background: 'linear-gradient(to right, rgba(14, 165, 233, 0), rgba(34, 211, 238, 0))',
                              boxShadow: '0 0 0px rgba(14, 165, 233, 0)',
                            }
                      }
                      transition={SPRING_PHYSICS.smooth}
                    />

                    {/* Checkbox */}
                    {selectable && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(rowId)}
                          className="w-4 h-4 rounded border-slate-600 cursor-pointer"
                        />
                      </td>
                    )}

                    {/* Data cells */}
                    {columns.map((column) => (
                      <td key={String(column.key)} className={`px-6 py-4 ${column.className || ''}`}>
                        <motion.div
                          animate={isHovered ? { x: 2 } : { x: 0 }}
                          transition={SPRING_PHYSICS.smooth}
                          className="text-slate-200"
                        >
                          {column.render
                            ? column.render(row[column.key], row)
                            : String(row[column.key])}
                        </motion.div>
                      </td>
                    ))}

                    {/* Action buttons (revealed on hover) */}
                    {actions.length > 0 && (
                      <td className="px-6 py-4 text-right">
                        <AnimatePresence>
                          {isHovered && (
                            <motion.div
                              className="flex items-center justify-end gap-1"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={SPRING_PHYSICS.snappy}
                            >
                              {actions.slice(0, 2).map((action, idx) => (
                                <motion.button
                                  key={idx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(row);
                                  }}
                                  className={`
                                    p-1.5 rounded hover:bg-slate-700/50 transition-colors
                                    ${action.variant === 'danger' ? 'text-red-400 hover:text-red-300' : 'text-slate-400 hover:text-slate-200'}
                                  `}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0 }}
                                  transition={{ delay: idx * 0.05 }}
                                  title={action.label}
                                >
                                  {action.icon}
                                </motion.button>
                              ))}

                              {actions.length > 2 && (
                                <motion.button
                                  className="p-1.5 rounded hover:bg-slate-700/50 text-slate-400 hover:text-slate-200"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </motion.button>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    )}
                  </motion.tr>
                );
              })}
        </motion.tbody>
      </table>
    </motion.div>
  );
}

// ============================================================================
// Table Cell Components
// ============================================================================

export function TableStatusCell({ status }: { status: string }) {
  const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
    active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'bg-yellow-400' },
    inactive: { bg: 'bg-slate-500/10', text: 'text-slate-400', dot: 'bg-slate-400' },
  };

  const colors = statusColors[status.toLowerCase()] || statusColors.inactive;

  return (
    <motion.span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div className={`w-2 h-2 rounded-full ${colors.dot}`} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      {status}
    </motion.span>
  );
}

export function TableAvatarCell({ name, avatar }: { name: string; avatar?: string }) {
  return (
    <motion.div
      className="flex items-center gap-3"
      whileHover={{ x: 2 }}
    >
      {avatar && <img src={avatar} alt={name} className="w-8 h-8 rounded-full" />}
      <span className="font-medium text-slate-200">{name}</span>
    </motion.div>
  );
}

export function TableBadgeCell({ badge }: { badge: string }) {
  return (
    <motion.span
      className="px-2 py-1 rounded-md text-xs font-medium bg-sky-500/20 text-sky-300"
      whileHover={{ scale: 1.05 }}
    >
      {badge}
    </motion.span>
  );
}
