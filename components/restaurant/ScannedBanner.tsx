import { Icon } from "@/components/ui/Icon";

/** Shown when Log a bin was opened from a bin's QR sticker. */
export function ScannedBanner({ branch }: { branch: string }) {
  return (
    <p role="status" className="flex items-center gap-2.5 rounded-[14px] bg-k-mint px-4 py-3 text-[15px] font-semibold text-k-forest">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-k-green text-white">
        <Icon name="check" size={17} strokeWidth={2.8} />
      </span>
      {branch} branch · Bin QR scanned
    </p>
  );
}
