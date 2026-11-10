"use client";

import { Icon } from "@/components/ui/Icon";
import { ConfirmButton } from "@/components/ui/ConfirmDialog";

/**
 * Erasing one's own comment or reply. The replies underneath are children of this row in the
 * database, so they are deleted with it — including replies written by other accounts, which is the
 * one consequence a person cannot guess from the word "hapus" and has to be told before clicking.
 */
export function DeleteCommentControl({
  onDelete,
  hasReplies,
}: {
  onDelete: () => Promise<boolean>;
  hasReplies: boolean;
}) {
  return (
    <ConfirmButton
      onConfirm={onDelete}
      triggerTitle="Hapus tanggapan Anda"
      triggerClassName="inline-flex items-center gap-1 text-xs font-normal text-slate-500 transition-colors hover:text-red-600"
      label={
        <>
          <Icon icon="solar:trash-bin-minimalistic-linear" className="h-3.5 w-3.5" />
          <span>Hapus</span>
        </>
      }
      confirmTitle="Hapus tanggapan Anda?"
      confirmLabel="Ya, hapus tanggapan"
      busyLabel="Menghapus..."
      body={
        hasReplies ? (
          <>
            <p>Tanggapan ini terhapus permanen dan tidak bisa dipulihkan.</p>
            <p className="pt-1.5">
              Balasan warga lain yang menempel di tanggapan ini ikut terhapus, dan mereka tidak bisa
              mengambilnya kembali.
            </p>
          </>
        ) : (
          <p>Tanggapan ini terhapus permanen dan tidak bisa dipulihkan, termasuk oleh moderator.</p>
        )
      }
    />
  );
}
