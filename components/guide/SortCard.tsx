import { Icon } from "@/components/ui/Icon";

type SortCardProps = {
  kind: "yes" | "no";
  title: string;
  subtitle: string;
  items: readonly string[];
};

/** One half of the sorting guide: a coloured header with a tick or cross, then the items. */
export function SortCard({ kind, title, subtitle, items }: SortCardProps) {
  const yes = kind === "yes";
  return (
    <section aria-label={title} className="overflow-hidden rounded-[18px] bg-card">
      <div className={`flex items-center gap-3 px-4 py-3 ${yes ? "bg-lime text-lime-ink" : "bg-night text-white"}`}>
        <span className={`flex size-[34px] shrink-0 items-center justify-center rounded-full ${yes ? "bg-forest text-lime" : "bg-white text-night"}`}>
          <Icon name={yes ? "check" : "x"} size={yes ? 18 : 16} strokeWidth={3.2} />
        </span>
        <div>
          <div className="text-[17px] font-bold">{title}</div>
          <div className={`text-[13px] ${yes ? "" : "text-on-hero-muted"}`}>{subtitle}</div>
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-x-3 px-4 pt-1.5 pb-2.5">
        {items.map((item) => (
          <li key={item} className="flex min-w-0 items-center gap-2 py-[9px] text-[15px]">
            <Icon name={yes ? "check" : "x"} size={13} strokeWidth={3.4} className={`shrink-0 ${yes ? "text-leaf" : "text-ink"}`} />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
