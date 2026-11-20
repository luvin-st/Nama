import type { ReactNode } from "react";
import { LogoEnglish } from "@/components/brand/Logo";
import { Notice, Pill } from "@/components/ui/Bits";
import { GroupLabel } from "@/components/ui/List";
import { SignOutForm } from "@/components/portal/SignOutForm";

/** Top bar: the Nama' wordmark, whose screens these are (restaurant group or "Nama staff") and Log out. */
export function KitchenHeader({ restaurant }: { restaurant: string }) {
  return (
    <header className="flex items-center justify-between gap-3 px-1">
      <span className="text-[var(--logo-ink)]">
        <LogoEnglish width={88} />
      </span>
      <div className="flex min-w-0 items-center gap-3">
        <Pill tone="wait">{restaurant}</Pill>
        <SignOutForm />
      </div>
    </header>
  );
}

/** Rounded card with an optional small heading above it, like the grouped lists. */
export function KCard({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <>
      {title ? <GroupLabel>{title}</GroupLabel> : null}
      <section className={`rounded-[14px] bg-card p-4 ${className}`}>{children}</section>
    </>
  );
}

/** Message box for load errors. */
export function KNotice({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[14px] bg-card">
      <Notice tone="error">{children}</Notice>
    </div>
  );
}
