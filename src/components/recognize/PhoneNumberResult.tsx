"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { PhoneReportForm } from "@/components/recognize/PhoneReportForm";
import { ScanResultPanel } from "@/components/recognize/ScanResultPanel";
import { useScanner } from "@/hooks/useScanner";
import { readPhoneResult } from "@/lib/phoneHandoff";
import { canonicalPhone, phoneInputProblem, phoneSlug } from "@/lib/phone";

/**
 * The verdict for one Indonesian number, at its own address: /recognize/phone/6281234567890.
 *
 * Usually the verdict arrives with the user: the search box on /recognize waits for the scan and
 * hands the finished report over before changing address. Arriving by bookmark or from somebody
 * else's link hands nothing over, and only then does this page run the check itself.
 */
export function PhoneNumberResult({ slug }: { slug: string }) {
  const scan = useScanner();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const [term, setTerm] = useState("");
  const [problem, setProblem] = useState("");
  const startPhoneScan = scan.startPhoneScan;
  const canonical = canonicalPhone(`+${slug}`);
  const [hiddenSlug, setHiddenSlug] = useState("");
  // The verdict handed over by /recognize is read straight from the cache instead of copied into
  // state: reading does not consume it, so the value is the same on every render and every pass of
  // the effect below, and nothing has to be re-set to be shown.
  const arrived = readPhoneResult(slug);
  const shown = hiddenSlug === slug ? scan.result : scan.result ?? arrived;

  // Only a number nobody just checked gets scanned here.
  useEffect(() => {
    if (!readPhoneResult(slug)) startPhoneScan(`+${slug}`);
  }, [slug, startPhoneScan]);

  const search = (event: React.FormEvent) => {
    event.preventDefault();
    const reason = phoneInputProblem(term);
    setProblem(reason);
    if (reason) return;
    const next = phoneSlug(term);
    // Pushing the address the page already has would be a no-op, so re-run the scan instead.
    if (next === slug) {
      setHiddenSlug(slug);
      startPhoneScan(term);
    }
    else router.push(`/recognize/phone/${next}`);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
      <div className="relative w-full rounded-2xl border border-gray-200/90 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:rounded-3xl sm:p-5">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="rounded-xl bg-slate-900 p-2 text-white"><Icon icon="solar:phone-bold-duotone" className="h-5 w-5" /></span>
          <div>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-600">Nomor Indonesia</span>
            <h4 className="mt-1 break-all text-base font-medium text-slate-900">{canonical}</h4>
          </div>
        </div>

        {scan.isScanning && <div aria-live="polite" className="flex items-center gap-2 py-2 text-xs font-normal text-slate-600"><Icon icon="solar:restart-bold-duotone" className="h-3.5 w-3.5 animate-spin text-red-600" /><span>{scan.scanStep || "Memeriksa nomor..."}</span></div>}
        {scan.errorMessage && !scan.isScanning && <p role="alert" className="py-1 text-left text-xs font-normal text-red-600">{scan.errorMessage}</p>}
        {shown && !scan.isScanning && <ScanResultPanel result={shown} resetLabel="Periksa nomor lain" onReset={() => { setTerm(""); setProblem(""); searchRef.current?.focus(); }} footer={<PhoneReportForm number={canonical} />} />}

        <form onSubmit={search} className="mt-3.5 border-t border-gray-100 pt-3">
          <div className="flex w-full gap-2">
            <span aria-hidden="true" className="flex items-center rounded-xl border border-gray-200 bg-slate-50 px-3 text-sm font-medium text-slate-600">+62</span>
            <input ref={searchRef} type="tel" aria-label="Cari nomor Indonesia lain" value={term}
              onChange={(event) => { setTerm(event.target.value); setProblem(""); }} placeholder="Cari nomor lain..."
              className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20" />
            <button type="submit" aria-label="Cari nomor" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-slate-900/20 active:scale-95 sm:h-10 sm:w-10"><Icon icon="solar:magnifer-linear" className="h-5 w-5" /></button>
          </div>
          {problem && <p role="alert" className="mt-1 text-left text-xs font-normal text-red-600">{problem}</p>}
        </form>
      </div>
    </div>
  );
}
