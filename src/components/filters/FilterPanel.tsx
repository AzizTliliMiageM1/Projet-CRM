"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  id: string;
  label: string;
  options: FilterOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

interface FilterPanelProps {
  filters: FilterConfig[];
  onClear?: () => void;
}

export function FilterPanel({ filters, onClear }: FilterPanelProps) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const hasActiveFilters = filters.some((f) => f.value.length > 0);

  const toggleFilter = (filterId: string) => {
    setOpenFilter(openFilter === filterId ? null : filterId);
  };

  const handleToggleOption = (filterId: string, optionValue: string) => {
    const filter = filters.find((f) => f.id === filterId);
    if (filter) {
      const newValue = filter.value.includes(optionValue)
        ? filter.value.filter((v) => v !== optionValue)
        : [...filter.value, optionValue];
      filter.onChange(newValue);
    }
  };

  const handleRemoveTag = (filterId: string, optionValue: string) => {
    const filter = filters.find((f) => f.id === filterId);
    if (filter) {
      const newValue = filter.value.filter((v) => v !== optionValue);
      filter.onChange(newValue);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <div key={filter.id} className="relative">
            <button
              onClick={() => toggleFilter(filter.id)}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                filter.value.length > 0
                  ? "bg-green-600/20 border border-green-600 text-green-400 hover:bg-green-600/30"
                  : "bg-slate-700 border border-slate-600 text-slate-300 hover:bg-slate-600"
              }`}
            >
              <span>{filter.label}</span>
              {filter.value.length > 0 && (
                <span className="bg-green-600/40 px-1.5 py-0.5 rounded text-xs font-semibold">
                  {filter.value.length}
                </span>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  openFilter === filter.id ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {openFilter === filter.id && (
              <div className="absolute z-50 top-full left-0 mt-2 w-48 rounded-lg border border-slate-700 bg-slate-900 shadow-lg">
                <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                  {filter.options.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer hover:bg-slate-800 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={filter.value.includes(option.value)}
                        onChange={() =>
                          handleToggleOption(filter.id, option.value)
                        }
                        className="rounded cursor-pointer"
                      />
                      <span className="text-sm text-slate-300">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Clear Button */}
        {hasActiveFilters && onClear && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium bg-slate-700 hover:bg-slate-600 text-slate-300 transition-all"
          >
            <X className="w-4 h-4" />
            Effacer filtres
          </button>
        )}
      </div>

      {/* Active Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) =>
            filter.value.map((value) => {
              const option = filter.options.find((o) => o.value === value);
              return (
                <div
                  key={`${filter.id}-${value}`}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-700 px-3 py-1 text-xs text-slate-300"
                >
                  <span>{option?.label || value}</span>
                  <button
                    onClick={() => handleRemoveTag(filter.id, value)}
                    className="hover:text-slate-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
