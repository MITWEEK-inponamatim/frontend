"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { ROLEPLAY_SCENARIOS } from "@/lib/scenarios";
import { ScenarioCard } from "./ScenarioCard";
import { ScenarioHeader } from "./ScenarioHeader";

const CATEGORIES = [
  "Semua Kategori",
  "SNIFFER SMS APK",
  "PHISHING BANK",
  "REKAYASA SOSIAL",
  "PEMERASAN DANA",
  "MALWARE ETLE",
  "LOWONGAN FIKTIF",
  "GIVEAWAY PALSU",
  "INVESTASI ILEGAL",
];

const STORAGE_KEY = "threatlens_completed_scenarios";

/**
 * Manages category filtering, search state, and grid presentation for roleplay scenarios.
 */
export function ScenarioSelector() {
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [searchQuery, setSearchQuery] = useState("");
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    const loadCompleted = () => {
      if (typeof window === "undefined") return;
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setCompletedIds(parsed);
        }
      } catch {
        // Ignore JSON/localStorage error
      }
    };

    loadCompleted();
    window.addEventListener("focus", loadCompleted);
    window.addEventListener("storage", loadCompleted);
    return () => {
      window.removeEventListener("focus", loadCompleted);
      window.removeEventListener("storage", loadCompleted);
    };
  }, []);

  const handleResetProgress = () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(STORAGE_KEY);
      setCompletedIds([]);
    } catch {
      // Ignore
    }
  };

  const completedCount = completedIds.length;
  const progressPercent = Math.round(
    (completedCount / ROLEPLAY_SCENARIOS.length) * 100,
  );

  const filteredScenarios = ROLEPLAY_SCENARIOS.filter((item) => {
    const matchesCategory =
      selectedCategory === "Semua Kategori" ||
      item.categoryBadge === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.personaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full">
      <ScenarioHeader
        categories={CATEGORIES}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Progress Tracker Card */}
      <div className="mb-6 rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div
              className={`grid h-8 w-8 place-items-center rounded-xl ${
                completedCount === ROLEPLAY_SCENARIOS.length
                  ? "bg-emerald-50 text-emerald-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <Icon
                icon={
                  completedCount === ROLEPLAY_SCENARIOS.length
                    ? "solar:shield-check-bold-duotone"
                    : "solar:shield-warning-bold-duotone"
                }
                className="h-4.5 w-4.5"
              />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-medium text-slate-900 leading-tight">
                Ketahanan Siber: {completedCount} dari {ROLEPLAY_SCENARIOS.length} Skenario Ditangkal
              </h2>
              <p className="text-[11px] font-normal text-slate-500 mt-0.5">
                {completedCount === ROLEPLAY_SCENARIOS.length
                  ? "Luar biasa! Anda telah berhasil menuntaskan seluruh simulasi kejahatan siber."
                  : completedCount === 0
                    ? "Mulai simulasi untuk melatih refleks mengenali rekayasa sosial penipuan digital."
                    : `${progressPercent}% kesiapan mandiri menghadapi serangan rekayasa sosial.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs font-mono font-medium text-slate-700">
              {progressPercent}%
            </span>
            {completedCount > 0 && (
              <button
                type="button"
                onClick={handleResetProgress}
                className="text-[11px] font-normal text-slate-400 hover:text-red-600 transition-colors pl-2 border-l border-slate-200"
                title="Reset progres pelatihan"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar Track */}
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              completedCount === ROLEPLAY_SCENARIOS.length
                ? "bg-emerald-500"
                : "bg-red-600"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {filteredScenarios.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white py-16 px-4 text-center">
          <p className="text-xs text-slate-400 font-normal">
            Tidak ada skenario yang cocok dengan pencarian Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredScenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              isCompleted={completedIds.includes(scenario.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
