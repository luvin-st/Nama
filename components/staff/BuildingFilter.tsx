"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type Props = { buildings: { id: string; name: string }[]; selectedId: string | null };

/** Building chips for the drops queue. Keeps the choice in the link (?building=…). Scrolls sideways if long. */
export function BuildingFilter({ buildings, selectedId }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const options = [{ id: null, name: "All" }, ...buildings];
  const current = buildings.some((b) => b.id === selectedId) ? selectedId : null;

  function choose(id: string | null) {
    startTransition(() => router.replace(id ? `/staff?building=${id}` : "/staff"));
  }

  return (
    <div
      role="group"
      aria-label="Filter by building"
      aria-busy={pending}
      className={`-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] ${pending ? "opacity-60" : ""}`}
    >
      {options.map((o) => {
        const on = o.id === current;
        return (
          <button
            key={o.id ?? "all"}
            type="button"
            aria-pressed={on}
            onClick={() => choose(o.id)}
            className={`shrink-0 whitespace-nowrap rounded-full px-3.5 py-2 text-[15px] ${
              on ? "bg-primary font-semibold text-on-primary" : "bg-card text-ink"
            }`}
          >
            {o.name}
          </button>
        );
      })}
    </div>
  );
}
