import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

/** Small uppercase heading above a grouped list, iOS style. */
export function GroupLabel({ children }: { children: ReactNode }) {
  return <h2 className="-mb-2 px-4 text-[13px] font-normal uppercase tracking-[0.3px] text-muted">{children}</h2>;
}

/** White rounded container; rows inside get hairline separators. */
export function ListGroup({ children }: { children: ReactNode }) {
  return <div className="divide-y-[0.5px] divide-sep overflow-hidden rounded-[14px] bg-card">{children}</div>;
}

type RowProps = {
  leading?: ReactNode;
  title: ReactNode;
  note?: ReactNode;
  trailing?: ReactNode;
  href?: string;
};

/** One list row. With `href`, the whole row becomes a link with a chevron. */
export function ListRow({ leading, title, note, trailing, href }: RowProps) {
  const body = (
    <>
      {leading}
      <div className="min-w-0 flex-1">
        <div className="text-[17px]">{title}</div>
        {note ? <div className="mt-px text-[13px] text-muted">{note}</div> : null}
      </div>
      {trailing}
      {href ? <Icon name="chevron" size={13} strokeWidth={3} className="shrink-0 text-muted" /> : null}
    </>
  );
  const cls = "flex min-h-[44px] items-center gap-3 px-4 py-[11px] text-ink";
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
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
