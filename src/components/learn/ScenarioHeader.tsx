import React from "react";
import { Icon } from "@/components/ui/Icon";

interface ScenarioHeaderProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

/**
 * Renders the top control bar with title, category filter dropdown, and search input.
 */
export function ScenarioHeader({
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: ScenarioHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl sm:text-2xl text-slate-900 font-normal tracking-tight">
          Simulasi Roleplay
        </h1>

        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="appearance-none rounded-full border border-slate-200 bg-white py-1.5 pl-3.5 pr-8 text-xs font-normal text-slate-700 shadow-2xs transition-colors hover:border-slate-300 focus:outline-hidden"
            aria-label="Pilih kategori roleplay"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="font-normal">
                Kategori: {cat}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon icon="solar:alt-arrow-down-linear" className="h-3 w-3" />
          </span>
        </div>
      </div>

      <div className="relative w-full sm:w-64">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari skenario..."
          className="w-full rounded-full border border-slate-200 bg-white py-1.5 pl-8 pr-3.5 text-xs font-normal text-slate-800 placeholder-slate-400 shadow-2xs transition-colors hover:border-slate-300 focus:outline-hidden focus:border-red-600"
        />
        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon icon="solar:magnifer-linear" className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}
