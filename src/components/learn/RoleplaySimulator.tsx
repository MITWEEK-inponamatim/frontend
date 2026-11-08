"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type {
  RoleplayScenarioDetail,
  MessageItem,
  ChoiceOption,
} from "@/lib/roleplayData";
import { WhatsAppChatSimulator } from "./whatsapp/WhatsAppChatSimulator";
import { ForensicDebriefSheet } from "./ForensicDebriefSheet";

/**
 * Wide desktop WhatsApp scam roleplay simulation viewport:
 * Coordinates multi-turn dialogue, real-time narrative climax,
 * and Apple HIG Inset Grouped forensic debrief.
 *
 * @param scenario - Scenario details, initial steps, and outcome definitions.
 */
export function RoleplaySimulator({
  scenario,
}: {
  scenario: RoleplayScenarioDetail;
}) {
  const initialStep = scenario.steps[scenario.initialStepId];

  const [currentStepId, setCurrentStepId] = useState(scenario.initialStepId);
  const [messages, setMessages] = useState<MessageItem[]>(
    initialStep?.messages ?? [],
  );
  const [isTyping, setIsTyping] = useState(false);
  const [personaStatus, setPersonaStatus] = useState("online");
  const [status, setStatus] = useState<"active" | "breached" | "victory">(
    "active",
  );
  const [isSheetMinimized, setIsSheetMinimized] = useState(false);

  const currentStep = scenario.steps[currentStepId];

  const handleSelectChoice = (choice: ChoiceOption) => {
    if (isTyping) return;

    const playerMsg: MessageItem = {
      id: `player_${Date.now()}`,
      sender: "player",
      text: choice.actionText,
      time: "13:46",
    };

    setMessages((prev) => [...prev, playerMsg]);

    // FATAL CHOICE CLIMAX (Realistic Narrative Chain)
    if (choice.riskLevel === "fatal" || choice.nextStepId === "outcome_breach") {
      setIsTyping(true);

      // Phase 1 (800ms): System Security Warning
      setTimeout(() => {
        setIsTyping(false);
        const installMsg: MessageItem = {
          id: `sys_install_${Date.now()}`,
          sender: "system",
          text:
            scenario.breachOutcome.systemWarningText ||
            "⚠️ [Peringatan Sistem] Terjadi pelanggaran keamanan dan izin sensitif disetujui.",
          time: "13:47",
        };
        setMessages((prev) => [...prev, installMsg]);

        // Phase 2 (2000ms): Intercepted SMS OTP or Drain Notification
        setTimeout(() => {
          const smsMsg: MessageItem = {
            id: `sys_sms_${Date.now()}`,
            sender: "system",
            text:
              scenario.breachOutcome.drainNotificationText ||
              scenario.breachOutcome.stolenOtp,
            time: "13:47",
          };
          setMessages((prev) => [...prev, smsMsg]);

          // Phase 3 (3200ms): Scammer exits conversation
          setTimeout(() => {
            const goodbyeMsg: MessageItem = {
              id: `persona_goodbye_${Date.now()}`,
              sender: "persona",
              text:
                scenario.breachOutcome.scammerExitText ||
                "Baik kak, terima kasih ya.",
              time: "13:48",
            };
            setMessages((prev) => [...prev, goodbyeMsg]);
            setPersonaStatus("offline");

            // Phase 4 (4400ms): Smoothly slide up forensic sheet
            setTimeout(() => {
              setStatus("breached");
              setIsSheetMinimized(false);
            }, 1200);
          }, 1200);
        }, 1200);
      }, 800);
      return;
    }

    // VICTORY CHOICE CLIMAX (Safe Resistance Chain)
    if (choice.nextStepId === "outcome_victory") {
      setIsTyping(true);

      // Phase 1 (1000ms): Scammer concedes and retreats
      setTimeout(() => {
        setIsTyping(false);
        const concedeMsg: MessageItem = {
          id: `persona_concede_${Date.now()}`,
          sender: "persona",
          text:
            scenario.victoryOutcome.scammerConcedeText ||
            "Yaudah kalau gak mau gapapa kak.",
          time: "13:48",
        };
        setMessages((prev) => [...prev, concedeMsg]);
        setPersonaStatus("offline");

        // Phase 2 (2000ms): System Defense Notification
        setTimeout(() => {
          const victoryMsg: MessageItem = {
            id: `sys_victory_${Date.now()}`,
            sender: "system",
            text:
              scenario.victoryOutcome.defenseNotificationText ||
              "🛡️ Upaya penipuan berhasil digagalkan tanpa kebocoran data.",
            time: "13:48",
          };
          setMessages((prev) => [...prev, victoryMsg]);

          // Phase 3 (3200ms): Smoothly slide up victory sheet
          setTimeout(() => {
            setStatus("victory");
            setIsSheetMinimized(false);
            if (typeof window !== "undefined") {
              try {
                const storageKey = "threatlens_completed_scenarios";
                const stored = localStorage.getItem(storageKey);
                const list: string[] = stored ? JSON.parse(stored) : [];
                if (!list.includes(scenario.id)) {
                  list.push(scenario.id);
                  localStorage.setItem(storageKey, JSON.stringify(list));
                }
              } catch {
                // Ignore storage errors in private browsing
              }
            }
          }, 1200);
        }, 1000);
      }, 1000);
      return;
    }

    // Standard Branching Turn
    const nextStep = scenario.steps[choice.nextStepId];
    if (nextStep) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setCurrentStepId(choice.nextStepId);
        setMessages((prev) => [...prev, ...nextStep.messages]);
      }, 800);
    }
  };

  const handleReset = () => {
    setCurrentStepId(scenario.initialStepId);
    setMessages(initialStep?.messages ?? []);
    setIsTyping(false);
    setPersonaStatus("online");
    setStatus("active");
    setIsSheetMinimized(false);
  };

  return (
    <div className="w-full max-w-5xl xl:max-w-6xl mx-auto flex flex-col">
      {/* Simulation Top Bar & Breadcrumb */}
      <header className="mb-3 flex w-full items-center justify-between px-1 sm:px-2 text-xs font-normal">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Icon icon="solar:arrow-left-linear" className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Daftar Skenario</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="truncate text-slate-800 font-normal">
            {scenario.title}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-[10px] font-normal text-red-700">
            {scenario.categoryBadge}
          </span>
        </div>
      </header>

      {/* Wide WhatsApp Main Screen Container */}
      <div className="relative w-full rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden bg-[#EFEAE2] flex flex-col h-[720px] sm:h-[760px] lg:h-[800px]">
        <WhatsAppChatSimulator
          scenario={scenario}
          statusText={personaStatus}
          messages={messages}
          isTyping={isTyping}
          choices={
            status === "active" && currentStep ? currentStep.choices : []
          }
          onSelectChoice={handleSelectChoice}
          onReset={handleReset}
        />

        {/* Minimized Sheet Restoration Pill */}
        {isSheetMinimized && status !== "active" && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 select-none">
            <button
              type="button"
              onClick={() => setIsSheetMinimized(false)}
              className="flex items-center gap-2 rounded-full bg-slate-900/90 text-white px-4 py-2 text-xs font-normal shadow-lg hover:bg-slate-950 backdrop-blur-xs transition-all"
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  status === "breached" ? "bg-[#FF3B30]" : "bg-[#34C759]"
                }`}
              />
              <span>Buka Laporan Forensik &uarr;</span>
            </button>
          </div>
        )}

        {/* Authentic Apple Inset Grouped Forensic Debrief Sheet */}
        {!isSheetMinimized && status !== "active" && (
          <ForensicDebriefSheet
            status={status}
            scenario={scenario}
            onRetry={handleReset}
            onClose={() => setIsSheetMinimized(true)}
          />
        )}
      </div>
    </div>
  );
}
