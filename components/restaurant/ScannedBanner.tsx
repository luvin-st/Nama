import { Icon } from "@/components/ui/Icon";
import { RowIcon } from "@/components/ui/List";

/** Shown when Log a bin was opened from a bin's QR sticker. */
export function ScannedBanner({ branch }: { branch: string }) {
  return (
    <p role="status" className="flex items-center gap-3 rounded-[14px] bg-card px-4 py-3 text-[17px] text-ink">
      <RowIcon tone="lime">
        <Icon name="check" size={16} strokeWidth={2.8} />
      </RowIcon>
      {branch} branch · Bin QR scanned
    </p>
  );
}
