import { GroupLabel, ListGroup, ListRow } from "@/components/ui/List";
import { WASTE_TYPES, type Branch } from "@/lib/kitchen";

/** Each branch: how many of its 3 bins (prep scraps, spoilage, plate leftovers) were logged today. */
export function BinsToday({ branches }: { branches: Branch[] }) {
  const total = WASTE_TYPES.length;
  return (
    <>
      <GroupLabel>Bins logged today</GroupLabel>
      <ListGroup>
        {branches.map((b) => {
          const done = Math.min(b.binsToday, total);
          return (
            <ListRow
              key={b.id}
              title={b.name}
              trailing={
                <span className="flex items-center gap-3">
                  <span className="flex gap-1" aria-hidden="true">
                    {WASTE_TYPES.map((t, i) => (
                      <span key={t} className={`size-2.5 rounded-full ${i < done ? "bg-leaf" : "bg-track"}`} />
                    ))}
                  </span>
                  <span className={`text-[15px] tabular-nums ${done === total ? "font-semibold text-ink" : "text-muted"}`}>
                    {done} of {total} bins
                  </span>
                </span>
              }
            />
          );
        })}
      </ListGroup>
    </>
  );
}
