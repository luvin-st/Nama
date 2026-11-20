import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LogoLockup } from "@/components/brand/Logo";
import { Doors } from "@/components/portal/Doors";
import { SignOutForm } from "@/components/portal/SignOutForm";
import { Notice } from "@/components/ui/Bits";
import { getMembership } from "@/lib/data/membership";
import { SIDE } from "@/lib/portal";

export const metadata: Metadata = { title: "Nama' | نماء" };

/** The front door: choose restaurant or Nama staff. Logged-in people go straight to their side. */
export default async function PortalPage() {
  const me = await getMembership();
  if (me.ok && me.data?.side) redirect(SIDE[me.data.side].home);

  return (
    <div className="flex flex-1 flex-col gap-4 pt-10 text-center">
      <LogoLockup />
      <h1 className="mt-5 text-balance text-[34px] font-bold leading-tight tracking-[-0.4px]">
        Food-waste collection with a monthly <span className="text-leaf">dirham</span> report
      </h1>
      <p className="-mt-1 text-[17px] leading-snug text-muted">
        Kitchens log their bins, our team collects them, and owners see what waste costs, branch by branch.
      </p>
      {!me.ok ? (
        <div className="rounded-[14px] bg-card text-left">
          <Notice tone="error">{me.error}</Notice>
        </div>
      ) : null}
      {me.ok && me.data ? (
        <div className="flex flex-col gap-1 rounded-[14px] bg-card pt-1 pb-3 text-left">
          <Notice>
            You&apos;re logged in as {me.data.email}, but this account isn&apos;t set up for Nama&apos;. Log out, then log in or
            create an account below.
          </Notice>
          <div className="px-4">
            <SignOutForm variant="button" />
          </div>
        </div>
      ) : null}
      <Doors />
    </div>
  );
}
