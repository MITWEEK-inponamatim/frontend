"use client";

import Image from "next/image";
import type { MessageItem } from "@/lib/roleplayData";
import { ApkAttachment } from "./ApkAttachment";

/**
 * Renders the chronological conversation thread between the scammer persona and the user.
 *
 * @param messages - Ordered array of chat messages.
 * @param personaName - Name of the scammer persona.
 * @param personaAvatar - Avatar image URL for the scammer.
 * @param isTyping - Boolean indicating whether persona is generating a response.
 */
export function ChatThread({
  messages,
  personaName,
  personaAvatar,
  isTyping,
}: {
  messages: MessageItem[];
  personaName: string;
  personaAvatar: string;
  isTyping: boolean;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 min-h-[380px] sm:min-h-[460px]">
      <div className="mx-auto my-2 max-w-xs text-center">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-normal text-slate-500">
          Simulasi Percakapan Aman &middot; Hari Ini
        </span>
      </div>

      {messages.map((item) => {
        const isPersona = item.sender === "persona";
        return (
          <div
            key={item.id}
            className={`flex items-end gap-2.5 ${isPersona ? "justify-start" : "justify-end"}`}
          >
            {isPersona && (
              <div className="relative h-8 w-8 shrink-0 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                <Image
                  src={personaAvatar}
                  alt={personaName}
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm font-normal leading-relaxed ${
                isPersona
                  ? "border border-slate-100 bg-slate-50/80 text-slate-900 rounded-bl-xs"
                  : "bg-slate-900 text-white rounded-br-xs"
              }`}
            >
              <p className="font-normal">{item.text}</p>

              {item.apkAttachment && (
                <ApkAttachment attachment={item.apkAttachment} />
              )}

              <div
                className={`mt-1.5 flex items-center justify-end text-[10px] font-normal ${
                  isPersona ? "text-slate-400" : "text-slate-400"
                }`}
              >
                <span>{item.time}</span>
              </div>
            </div>
          </div>
        );
      })}

      {isTyping && (
        <div className="flex items-end gap-2.5 justify-start">
          <div className="relative h-8 w-8 shrink-0 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
            <Image
              src={personaAvatar}
              alt={personaName}
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2.5 rounded-bl-xs">
            <div className="flex items-center gap-1.5 text-xs font-normal text-slate-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-400 animate-pulse" />
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:200ms]" />
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-slate-400 animate-pulse [animation-delay:400ms]" />
              <span className="ml-1 text-[11px] font-normal text-slate-400">
                {personaName} sedang mengetik...
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

