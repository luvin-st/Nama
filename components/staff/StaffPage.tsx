import type { ReactNode } from "react";
import { BackBar } from "@/components/auth/BackBar";

type Props = { title: string; backHref: string; wide?: boolean; children: ReactNode };

/** Page column for staff screens: back bar on top, normal app look. */
export function StaffPage({ title, backHref, wide = false, children }: Props) {
  return (
    <main
      className={`mx-auto flex flex-col gap-4 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-12 pl-[max(16px,env(safe-area-inset-left,0px))] pr-[max(16px,env(safe-area-inset-right,0px))] ${
        wide ? "max-w-[720px]" : "max-w-[440px]"
      }`}
    >
      <BackBar href={backHref} title={title} />
      {children}
    </main>
  );
}
