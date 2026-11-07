"use client";

import React, { useState } from "react";
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

/**
 * Manages category filtering, search state, and grid presentation for roleplay scenarios.
 */
export function ScenarioSelector() {
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [searchQuery, setSearchQuery] = useState("");

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

      {filteredScenarios.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white py-16 px-4 text-center">
          <p className="text-xs text-slate-400 font-normal">
            Tidak ada skenario yang cocok dengan pencarian Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredScenarios.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))}
        </div>
      )}
    </div>
  );
}
