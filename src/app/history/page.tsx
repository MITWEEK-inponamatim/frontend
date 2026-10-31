"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { IdleSessionMonitor } from "@/components/auth/IdleSessionMonitor";
type Scan = { id: string; type: string; status: string; outcome: string | null; risk_level: string | null; created_at: string };
export default function HistoryPage() {
  const [scans, setScans] = useState<Scan[]>([]); const [error, setError] = useState("");
  useEffect(() => { api("/api/v1/scans").then((data) => setScans(data.scans)).catch(() => setError("Riwayat tidak dapat dimuat.")); }, []);
  return <main className="mx-auto min-h-screen max-w-4xl px-5 py-8"><IdleSessionMonitor/><nav className="flex justify-between"><Link href="/recognize">ThreatLens</Link><LogoutButton/></nav><h1 className="mt-12 text-3xl">Riwayat scan</h1>{error && <p role="alert" className="mt-5 text-red-700">{error}</p>}<ul className="mt-6 divide-y">{scans.map((scan) => <li key={scan.id} className="flex justify-between py-4"><span>{scan.type} · {scan.status}</span><span>{scan.risk_level ?? scan.outcome ?? "—"}</span></li>)}</ul>{!scans.length && !error && <p className="mt-6 text-slate-500">Belum ada scan.</p>}</main>;
}
