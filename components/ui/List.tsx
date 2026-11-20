import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

export { GroupLabel, ListGroup, RowIcon } from "./Group";

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
