"use client";

import { useEffect, useRef, useState } from "react";
import type {
  MessageItem,
  ChoiceOption,
  RoleplayScenarioDetail,
  ApkAttachmentData,
} from "@/lib/roleplayData";
import { WhatsAppHeader } from "./WhatsAppHeader";
import { WhatsAppDoodleBg } from "./WhatsAppDoodleBg";
import { WhatsAppBubble, WhatsAppTypingBubble } from "./WhatsAppBubble";
import { WhatsAppInputBar } from "./WhatsAppInputBar";
import { ThreatInspectorModal } from "../ThreatInspectorModal";

/**
 * Reusable wide WhatsApp chat simulator container used across all roleplay scenarios.
 *
 * @param scenario - Scenario details containing persona, threat targets, and story.
 * @param statusText - Current connectivity or typing status.
 * @param messages - Array of chronological chat messages.
 * @param isTyping - Boolean indicating if persona is generating a response.
 * @param choices - Available dialogue response options for user.
 * @param onSelectChoice - Callback when a dialogue response is clicked.
 * @param onReset - Callback to replay simulation.
 */
export function WhatsAppChatSimulator({
  scenario,
  statusText,
  messages,
  isTyping,
  choices,
  onSelectChoice,
  onReset,
}: {
  scenario: RoleplayScenarioDetail;
  statusText: string;
  messages: MessageItem[];
  isTyping: boolean;
  choices: ChoiceOption[];
  onSelectChoice: (choice: ChoiceOption) => void;
  onReset?: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inspector, setInspector] = useState<{
    open: boolean;
    type: "file" | "contact";
    fileAttachment?: ApkAttachmentData;
  }>({
    open: false,
    type: "file",
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="relative flex h-full flex-1 flex-col overflow-hidden bg-[#ECE5DD] min-h-[580px] sm:min-h-[640px]">
      {/* WhatsApp Top Navigation Header */}
      <WhatsAppHeader
        personaName={scenario.personaName}
        personaAvatar={scenario.personaAvatar}
        statusText={isTyping ? "sedang mengetik..." : statusText}
        onReset={onReset}
        onInspectContact={() =>
          setInspector({ open: true, type: "contact" })
        }
      />

      {/* WhatsApp Doodle Canvas Area */}
      <div className="relative flex-1 overflow-hidden">
        <WhatsAppDoodleBg />

        <div
          ref={scrollRef}
          className="relative z-10 flex h-full flex-col overflow-y-auto px-4 sm:px-8 md:px-12 lg:px-16 py-4 scroll-smooth"
        >
          {/* Centered Date Pill */}
          <div className="mx-auto my-2 text-center">
            <span className="rounded-md bg-[#DDE3EA]/90 px-3 py-1 text-[11px] font-normal text-slate-600 shadow-2xs select-none">
              Hari ini
            </span>
          </div>

          {/* Conversation Stream */}
          <div className="space-y-1.5">
            {messages.map((message) => (
              <WhatsAppBubble
                key={message.id}
                message={message}
                onInspect={
                  message.apkAttachment
                    ? () =>
                        setInspector({
                          open: true,
                          type: "file",
                          fileAttachment: message.apkAttachment,
                        })
                    : undefined
                }
              />
            ))}

            {isTyping && <WhatsAppTypingBubble />}
          </div>
        </div>
      </div>

      {/* WhatsApp Bottom Input Bar & AU Choice Tray */}
      <WhatsAppInputBar
        choices={choices}
        disabled={isTyping}
        onSelect={onSelectChoice}
      />

      {/* On-Demand Contextual Threat Intelligence Inspector */}
      <ThreatInspectorModal
        isOpen={inspector.open}
        type={inspector.type}
        scenario={scenario}
        fileAttachment={inspector.fileAttachment}
        onClose={() => setInspector((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
