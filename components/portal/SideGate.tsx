import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { LogoEnglish } from "@/components/brand/Logo";
import { Notice } from "@/components/ui/Bits";
import { LinkButton } from "@/components/ui/Button";
import { getMembership } from "@/lib/data/membership";
import { SIDE, type Side } from "@/lib/portal";
import { SignOutForm } from "./SignOutForm";

const WRONG: Record<Side, string> = {
  restaurant: "This page is for restaurant accounts.",
  staff: "This page is for Nama staff.",
};

/** Shows `children` only to people on `side`; everyone else is sent to the portal or told why not. */
export async function SideGate({ side, children }: { side: Side; children: ReactNode }) {
  const me = await getMembership();
  if (me.ok && !me.data) redirect(SIDE[side].login);
  if (me.ok && me.data && !me.data.side) redirect("/");
  if (me.ok && me.data?.side === side) return <>{children}</>;

  const other = me.ok ? me.data?.side : null;
  return (
    <div className="flex flex-col gap-4 pt-2">
      <span className="px-1 text-[var(--logo-ink)]">
        <LogoEnglish width={88} />
      </span>
      <div className="flex flex-col gap-3 rounded-[14px] bg-card pb-4">
        <Notice tone={me.ok ? "muted" : "error"}>{me.ok ? WRONG[side] : me.error}</Notice>
        <div className="flex flex-col gap-1 px-4">
          {other ? <LinkButton href={SIDE[other].home}>Go to my screens</LinkButton> : null}
          <SignOutForm variant="button" />
        </div>
      </div>
    </div>
  );
}
