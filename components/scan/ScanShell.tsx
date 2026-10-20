import Link from "next/link";
import type { ReactNode } from "react";

type ScanShellProps = { title: string; cancelHref?: string; cancelLabel?: string; children: ReactNode };

/** Full-screen dark layout shared by the scan screens. */
export function ScanShell({ title, cancelHref = "/home", cancelLabel = "Cancel", children }: ScanShellProps) {
  return (
    <main className="min-h-full bg-scan text-white">
      <div className="mx-auto flex min-h-dvh max-w-[440px] flex-col gap-6 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-[calc(env(safe-area-inset-bottom,0px)+28px)] pl-[max(16px,env(safe-area-inset-left,0px))] pr-[max(16px,env(safe-area-inset-right,0px))]">
        <div className="grid min-h-11 grid-cols-[1fr_auto_1fr] items-center">
          <Link href={cancelHref} className="justify-self-start py-2.5 text-[17px] text-lime">
            {cancelLabel}
          </Link>
          <h1 className="text-[17px] font-semibold">{title}</h1>
          <span />
        </div>
        {children}
      </div>
    </main>
  );
}

/** Centred heading and explanation inside a scan screen. */
export function ScanHeading({ title, text }: { title: string; text?: ReactNode }) {
  return (
    <div className="text-center">
      <h2 className="text-balance text-[22px] font-bold">{title}</h2>
      {text ? <p className="mt-1.5 text-[15px] leading-snug text-on-hero-muted">{text}</p> : null}
    </div>
  );
}
