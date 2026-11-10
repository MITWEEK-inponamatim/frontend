"use client";

import { Icon } from "@/components/ui/Icon";
import { ConfirmButton } from "@/components/ui/ConfirmDialog";

/**
 * The author's own way out of a story they posted. The dialog names everything that disappears with
 * it — the write-up, the reactions under it, and the screenshot — because "hapus" alone does not say
 * that nobody can get any of it back, the author least of all.
 */
export function DeletePostControl({
  onDelete,
  triggerClassName = "px-2.5 py-1.5",
}: {
  onDelete: () => Promise<boolean>;
  triggerClassName?: string;
}) {
  return (
    <ConfirmButton
      onConfirm={onDelete}
      triggerTitle="Hapus cerita Anda"
      triggerClassName={`inline-flex items-center gap-1.5 rounded-lg font-normal text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700 ${triggerClassName}`}
      label={
        <>
          <Icon icon="solar:trash-bin-minimalistic-linear" className="h-3.5 w-3.5 shrink-0" />
          <span>Hapus</span>
        </>
      }
      confirmTitle="Hapus cerita ini?"
      confirmLabel="Ya, hapus cerita"
      busyLabel="Menghapus..."
      body={
        <>
          <p>Cerita ini, tanggapan warga di bawahnya, dan gambar buktinya ikut terhapus dan tidak bisa dipulihkan.</p>
          <p className="pt-1.5">Tulisannya hilang dari papan, dari pencarian, dan dari daftar cerita Anda.</p>
        </>
      }
    />
  );
}
