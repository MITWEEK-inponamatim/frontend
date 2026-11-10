"use client";

import { useEffect, useState } from "react";
import { useAdminConsole } from "@/components/admin/AdminShell";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  DecisionButtons,
  EvidenceShot,
  FactRow,
  LedgerRow,
  NoEvidence,
  NumberSubject,
  QueueCard,
  QueueNotice,
  QueueSkeleton,
  RowLink,
  RowSplit,
  VerdictMark,
} from "@/components/admin/queue-ui";
import { useModerationQueue } from "@/hooks/useModerationQueue";
import { displayNumber } from "@/lib/community";
import { phoneSlug } from "@/lib/phone";
import {
  REPORT_QUEUES,
  REPORT_STATUS_META,
  deskStamp,
  reportCategoryLabel,
  reportConfirmation,
  reportDecisions,
  reportSourceLabel,
  type ModeratedReport,
  type ReportStatus,
} from "@/lib/admin";

const QUEUE_PATH = "/api/v1/admin/community/reports";
const patchPath = (id: string) => `${QUEUE_PATH}/${id}/status`;

/**
 * The report queue: what a number was accused of, in the reporter's own words, with the screenshot
 * beside it. One row is one account's claim, so agreeing with it is a statement about that claim,
 * and the consequence of agreeing — one approval puts the number on the citizens' board — is read in
 * the dialog before the write happens.
 */
export function ReportQueue() {
  const { search, setDraft, announce } = useAdminConsole();
  const [queue, setQueue] = useState<ReportStatus | "all">("pending");
  const [target, setTarget] = useState<{ id: string; to: string } | null>(null);
  const [asked, setAsked] = useState<{ row: ModeratedReport; to: ReportStatus } | null>(null);
  const { rows, meta, loading, errorMessage, pendingID, page, lastPage, decide, reload, previousPage, nextPage } =
    useModerationQueue<ModeratedReport>({ path: QUEUE_PATH, patchPath, queue, search });

  useEffect(() => {
    if (errorMessage) announce(errorMessage);
  }, [errorMessage, announce]);

  // A click asks first, the dialog's button writes. The row is decided by a human about something a
  // human may regret, and the consequence — one approval puts a number on the citizens' board — is
  // worth reading in a sentence before it happens rather than hovering a label.
  const write = async () => {
    if (!asked) return;
    const { row, to } = asked;
    setTarget({ id: row.id, to });
    const moved = await decide(row, to);
    setTarget(null);
    if (moved) {
      setAsked(null);
      announce(`Laporan ${displayNumber(row.number_e164)} ditandai ${REPORT_STATUS_META[to].label}.`);
    }
  };

  const confirmation = asked ? reportConfirmation(asked.to) : null;

  return (
    <div className="flex min-w-0 flex-col gap-4 @3xl/main:gap-5">
      <QueueCard
        queues={REPORT_QUEUES}
        queue={queue}
        onQueue={(id) => setQueue(id as ReportStatus | "all")}
        noun="laporan"
        meta={meta}
        shown={rows.length}
        page={page}
        lastPage={lastPage}
        onPrevious={previousPage}
        onNext={nextPage}
        search={search}
        onClearSearch={() => setDraft("")}
      >
        {loading ? (
          <QueueSkeleton />
        ) : errorMessage ? (
          <QueueNotice
            kind="error"
            title="Antrean tidak dapat dimuat"
            body={errorMessage}
            actionLabel="Muat ulang"
            onAction={reload}
          />
        ) : rows.length === 0 ? (
          search ? (
            <QueueNotice
              kind="empty"
              title="Tidak ada laporan yang cocok"
              body={`Kata “${search}” tidak muncul di laporan mana pun pada antrean ini. Coba nomor sebagian, atau kata yang lebih pendek.`}
              actionLabel="Hapus filter"
              onAction={() => setDraft("")}
            />
          ) : (
            <QueueNotice
              kind="empty"
              title={queue === "pending" ? "Antrean bersih" : "Belum ada laporan di sini"}
              body={
                queue === "pending"
                  ? "Tidak ada laporan nomor yang menunggu keputusan."
                  : "Antrean ini kosong. Buka tab Semua untuk melihat laporan dalam setiap status."
              }
            />
          )
        ) : (
          rows.map((row, index) => (
            <ReportCard
              key={row.id}
              row={row}
              zebra={index % 2 === 1}
              busy={pendingID === row.id}
              pendingTo={target?.id === row.id ? target.to : null}
              onPick={(to) => setAsked({ row, to })}
            />
          ))
        )}
      </QueueCard>

      {asked && confirmation && (
        <ConfirmDialog
          open
          surface="desk"
          title={confirmation.title}
          body={confirmation.body}
          confirmLabel={confirmation.confirmLabel}
          busyLabel="Menyimpan"
          busy={pendingID === asked.row.id}
          onConfirm={() => void write()}
          onCancel={() => setAsked(null)}
        />
      )}
    </div>
  );
}

function ReportCard({
  row,
  zebra,
  busy,
  pendingTo,
  onPick,
}: {
  row: ModeratedReport;
  zebra: boolean;
  busy: boolean;
  pendingTo: string | null;
  onPick: (to: ReportStatus) => void;
}) {
  const status = REPORT_STATUS_META[row.status] ?? REPORT_STATUS_META.pending;
  const number = displayNumber(row.number_e164);
  const slug = phoneSlug(row.number_e164);

  return (
    <LedgerRow tone={status.tone} zebra={zebra}>
      <RowSplit
        matter={
          <>
            <NumberSubject e164={number} />

            <FactRow>
              <span className="font-medium text-desk-ink">{reportCategoryLabel(row.category)}</span>
              <span>{reportSourceLabel(row.source)}</span>
              <span className="tabular-nums">{deskStamp(row.created_at)}</span>
              <span>{row.reporter_alias || "Akun tanpa nama"}</span>
            </FactRow>

            {row.note ? (
              <p className="max-w-[68ch] pt-3 text-[14px] leading-[1.65] text-desk-ink">{row.note}</p>
            ) : (
              <p className="pt-3 text-[14px] leading-[1.65] text-desk-faint">Pelapor tidak menulis catatan.</p>
            )}
          </>
        }
        proof={
          row.evidence_url ? (
            <EvidenceShot url={row.evidence_url} alt={`Bukti gambar laporan ${number}`} />
          ) : (
            <NoEvidence />
          )
        }
        decision={
          <>
            <VerdictMark tone={status.tone} label={status.label} title={status.meaning} />
            <DecisionButtons
              decisions={reportDecisions(row.status)}
              pendingTo={pendingTo}
              blocked={busy}
              onPick={onPick}
            />
            {slug && (
              <RowLink href={`/recognize/phone/${slug}`} title={`Buka halaman ${number} di papan hasil`}>
                Halaman nomor ini
              </RowLink>
            )}
          </>
        }
      />
    </LedgerRow>
  );
}
