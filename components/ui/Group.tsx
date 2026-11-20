import type { ReactNode } from "react";

// Link-free list pieces. Interactive (client) components import these from here rather than
// from List.tsx, which also carries next/link; pulling that into a form left it stuck on "Saving…".

/** Small uppercase heading above a grouped list, iOS style. */
export function GroupLabel({ children }: { children: ReactNode }) {
  return <h2 className="-mb-2 px-4 text-[13px] font-normal uppercase tracking-[0.3px] text-muted">{children}</h2>;
}

/** White rounded container; rows inside get hairline separators. */
export function ListGroup({ children }: { children: ReactNode }) {
  return <div className="divide-y-[0.5px] divide-sep overflow-hidden rounded-[14px] bg-card">{children}</div>;
}

type Tone = "forest" | "leaf" | "lime";
const TONES: Record<Tone, string> = {
  forest: "bg-forest text-lime",
  leaf: "bg-[#2f7a4d] text-white",
  lime: "bg-lime text-lime-ink",
};

/** Rounded-square icon used at the start of a row. */
export function RowIcon({ tone, children }: { tone: Tone; children: ReactNode }) {
  return <span className={`flex size-[30px] shrink-0 items-center justify-center rounded-lg ${TONES[tone]}`}>{children}</span>;
}

/** A list row without a link (same look as ListRow). */
export function StaticRow({ leading, title, note, trailing }: { leading?: ReactNode; title: ReactNode; note?: ReactNode; trailing?: ReactNode }) {
  return (
    <div className="flex min-h-[44px] items-center gap-3 px-4 py-[11px] text-ink">
      {leading}
      <div className="min-w-0 flex-1">
        <div className="text-[17px]">{title}</div>
        {note ? <div className="mt-px text-[13px] text-muted">{note}</div> : null}
      </div>
      {trailing}
    </div>
  );
}
