"use client";

import type { MessageItem } from "@/lib/roleplayData";
import { WhatsAppDocumentCard } from "./WhatsAppDocumentCard";

function formatMessageContent(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <span
          key={index}
          className="text-[#027EB5] underline cursor-pointer hover:opacity-85 font-mono text-[12px] break-all"
        >
          {part}
        </span>
      );
    }
    return part;
  });
}

/**
 * Individual chat bubble with pixel-perfect WhatsApp tails, timestamps, double ticks,
 * and realistic system narrative banners for security events and SMS OTP notifications.
 *
 * @param message - The message object containing sender, text, timestamp, and optional attachment.
 * @param onInspect - Optional callback to inspect document attachment.
 */
export function WhatsAppBubble({
  message,
  onInspect,
}: {
  message: MessageItem;
  onInspect?: () => void;
}) {
  // System Narrative Climax: Push Notifications & Security Events
  if (message.sender === "system") {
    if (message.id.startsWith("sys_sms")) {
      return (
        <div className="mx-auto my-3 w-full max-w-md select-none px-2">
          <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 shadow-sm">
            <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-100">
              <span className="flex items-center gap-1.5 font-normal text-slate-900">
                <span className="h-2 w-2 rounded-full bg-[#FF3B30]" />
                <span>Pemberitahuan SMS &middot; Bank BCA</span>
              </span>
              <span className="text-[10px] text-slate-400">{message.time}</span>
            </div>
            <p className="mt-2 text-xs font-mono font-normal text-slate-800 leading-relaxed whitespace-pre-wrap">
              {message.text}
            </p>
          </div>
        </div>
      );
    }

    const isSecurityAlert = message.id.startsWith("sys_install");
    return (
      <div className="mx-auto my-2 max-w-md text-center select-none px-2">
        <span
          className={`inline-block rounded-lg px-3 py-1.5 text-[11px] font-normal leading-relaxed ${
            isSecurityAlert
              ? "bg-[#FFEBEA] text-[#D32F2F] border border-[#FCD8D2]"
              : "bg-[#EDF7ED] text-[#2E7D32] border border-[#C8E6C9]"
          }`}
        >
          {message.text}
        </span>
      </div>
    );
  }

  const isOutgoing = message.sender === "player";

  return (
    <div
      className={`relative flex w-full ${isOutgoing ? "justify-end" : "justify-start"} my-1.5`}
    >
      <div
        className={`relative max-w-[88%] sm:max-w-[75%] lg:max-w-[540px] rounded-2xl p-2.5 sm:p-3 text-xs sm:text-[13px] font-normal leading-relaxed shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] ${
          isOutgoing
            ? "rounded-tr-none bg-[#DCF7C5] text-slate-900"
            : "rounded-tl-none bg-white text-slate-900"
        }`}
      >
        {/* Authentic WhatsApp Bubble Tail */}
        {isOutgoing ? (
          <svg
            viewBox="0 0 8 13"
            aria-hidden="true"
            className="absolute -right-2 top-0 h-[13px] w-[8px] fill-[#DCF7C5]"
          >
            <path d="M5.188 0H0v12.193l6.467-8.625C7.526 2.156 6.958 0 5.188 0z" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 8 13"
            aria-hidden="true"
            className="absolute -left-2 top-0 h-[13px] w-[8px] fill-white"
          >
            <path d="M1.533 3.568 8 12.193V0H2.812C1.042 0 .474 2.156 1.533 3.568z" />
          </svg>
        )}

        {/* Message Text or Document Card */}
        {message.apkAttachment ? (
          <WhatsAppDocumentCard
            attachment={message.apkAttachment}
            isOutgoing={isOutgoing}
            time={message.time}
            showDoubleCheck={isOutgoing}
            onInspect={onInspect}
          />
        ) : (
          <div>
            <p className="font-normal whitespace-pre-wrap">
              {formatMessageContent(message.text)}
            </p>
            <div className="mt-1 flex items-center justify-end gap-1 text-[10px] font-normal text-slate-400">
              <span>{message.time}</span>
              {isOutgoing && (
                <svg
                  viewBox="0 0 16 11"
                  className="h-3 w-4 text-[#34B7F1] fill-current shrink-0"
                >
                  <path d="M11.15 1.15 5.5 6.8 3.85 5.15 2.5 6.5l3 3 7-7-1.35-1.35zm3.5 0-7 7-1.4-1.4 1.4-1.4 5.6-5.6 1.4 1.4z" />
                </svg>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


/**
 * Three bouncing dots bubble displayed while the persona is generating a response.
 */
export function WhatsAppTypingBubble() {
  return (
    <div className="relative flex w-full justify-start my-1.5">
      <div className="relative rounded-2xl rounded-tl-none bg-white px-4 py-3 shadow-[0_1px_0.5px_rgba(11,20,26,0.13)]">
        <svg
          viewBox="0 0 8 13"
          aria-hidden="true"
          className="absolute -left-2 top-0 h-[13px] w-[8px] fill-white"
        >
          <path d="M1.533 3.568 8 12.193V0H2.812C1.042 0 .474 2.156 1.533 3.568z" />
        </svg>
        <div className="flex items-center gap-1.5 py-0.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8696A0] animate-bounce [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#8696A0] animate-bounce [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#8696A0] animate-bounce" />
        </div>
      </div>
    </div>
  );
}
