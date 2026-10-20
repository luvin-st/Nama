import { Icon } from "@/components/ui/Icon";
import { GroupLabel } from "@/components/ui/List";
import type { Badge } from "@/lib/badges";

function BadgeTile({ badge }: { badge: Badge }) {
  return (
    <li className={`flex flex-col items-center gap-1.5 rounded-[14px] bg-card px-2 py-3.5 text-center ${badge.earned ? "" : "opacity-75"}`}>
      <span
        className={`flex size-12 items-center justify-center rounded-full ${badge.earned ? "bg-lime text-lime-ink" : "bg-chip text-muted"}`}
      >
        <Icon name={badge.earned ? badge.icon : "lock"} size={22} strokeWidth={2.2} />
      </span>
      <span className="text-[14px] font-semibold leading-tight">{badge.title}</span>
      <span className="text-[12px] leading-tight text-muted">{badge.caption}</span>
      {badge.earned ? null : (
        <span className="mt-0.5 h-1 w-12 overflow-hidden rounded bg-track" aria-hidden="true">
          <span className="block h-full rounded bg-leaf" style={{ width: `${badge.progress}%` }} />
        </span>
      )}
    </li>
  );
}

/** Six badges: earned ones coloured, locked ones show progress. */
export function BadgeGrid({ badges }: { badges: Badge[] }) {
  const earned = badges.filter((b) => b.earned).length;
  return (
    <>
      <GroupLabel>
        Badges · {earned} of {badges.length}
      </GroupLabel>
      <ul className="grid grid-cols-3 gap-2.5">
        {badges.map((b) => (
          <BadgeTile key={b.id} badge={b} />
        ))}
      </ul>
    </>
  );
}
