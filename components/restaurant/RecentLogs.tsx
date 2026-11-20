import { relativeDay } from "@/lib/format";
import { clockTime, WASTE, type BinLog } from "@/lib/kitchen";
import { KCard } from "./KitchenShell";

/** The last few bins logged across all branches. */
export function RecentLogs({ logs }: { logs: BinLog[] }) {
  return (
    <KCard title="Latest bins">
      {logs.length === 0 ? (
        <p className="py-2 text-[15px] text-k-muted">No bins logged this month yet.</p>
      ) : (
        <ul className="divide-y divide-k-line">
          {logs.map((l) => (
            <li key={l.id} className="flex items-center gap-3 py-2.5">
              <span aria-hidden="true" className="text-[22px]">{WASTE[l.wasteType].emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-k-ink">
                  {l.weightKg} kg {WASTE[l.wasteType].label.toLowerCase()}
                </p>
                <p className="text-[13px] text-k-muted">
                  {l.branch} · {relativeDay(l.loggedAt)}, {clockTime(l.loggedAt)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </KCard>
  );
}
