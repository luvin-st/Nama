import { WASTE_TYPES, type Branch } from "@/lib/kitchen";
import { KCard } from "./KitchenShell";

/** Each branch: how many of its 3 bins (prep scraps, spoilage, plate leftovers) were logged today. */
export function BinsToday({ branches }: { branches: Branch[] }) {
  const total = WASTE_TYPES.length;
  return (
    <KCard title="Bins logged today">
      <ul className="flex flex-col gap-3">
        {branches.map((b) => {
          const done = Math.min(b.binsToday, total);
          return (
            <li key={b.id} className="flex items-center gap-3">
              <span className="flex-1 text-[15px] font-semibold text-k-ink">{b.name}</span>
              <span className="flex gap-1" aria-hidden="true">
                {WASTE_TYPES.map((t, i) => (
                  <span key={t} className={`size-2.5 rounded-full ${i < done ? "bg-k-green" : "bg-k-line"}`} />
                ))}
              </span>
              <span className={`w-[92px] text-right text-[14px] ${done === total ? "font-semibold text-k-green" : "text-k-muted"}`}>
                {done} of {total} bins
              </span>
            </li>
          );
        })}
      </ul>
    </KCard>
  );
}
