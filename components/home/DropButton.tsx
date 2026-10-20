import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

/** Big lime call-to-action that starts the scan flow. */
export function DropButton({ pendingCount }: { pendingCount: number }) {
  return (
    <Link href="/scan" className="flex items-center gap-3.5 rounded-[18px] bg-lime p-4 text-lime-ink">
      <span className="flex size-[46px] shrink-0 items-center justify-center rounded-xl bg-forest text-lime">
        <Icon name="scan" size={24} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[17px] font-semibold">Drop Your Scraps</span>
        <span className="block text-[15px]">
          {pendingCount > 0 ? `${pendingCount} drop${pendingCount === 1 ? "" : "s"} being checked` : "Scan the bin to earn points"}
        </span>
      </span>
      <Icon name="chevron" size={14} strokeWidth={3} className="shrink-0" />
    </Link>
  );
}
