import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

/** Top bar with a back link and a centred title. */
export function BackBar({ href, title }: { href: string; title: string }) {
  return (
    <div className="grid min-h-11 grid-cols-[1fr_auto_1fr] items-center">
      <Link href={href} className="flex items-center gap-1 justify-self-start py-2.5 text-[17px] text-link">
        <Icon name="back" size={18} strokeWidth={2.4} />
        Back
      </Link>
      <span className="text-[17px] font-semibold">{title}</span>
      <span />
    </div>
  );
}
