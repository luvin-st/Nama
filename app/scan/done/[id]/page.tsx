import type { Metadata } from "next";
import Link from "next/link";
import { ScanHeading, ScanShell } from "@/components/scan/ScanShell";
import { ScanSteps } from "@/components/scan/ScanSteps";
import { Icon } from "@/components/ui/Icon";
import { getDeposit } from "@/lib/data/deposits";
import { formatKg } from "@/lib/format";

export const metadata: Metadata = { title: "Deposit Received · Nama'" };

const DONE_LINK = "flex h-[52px] items-center justify-center rounded-[14px] bg-lime text-[17px] font-semibold text-lime-ink";

export default async function DonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getDeposit(id);

  if (!res.ok || !res.data) {
    return (
      <ScanShell title="Your Drop" cancelLabel="Home">
        <ScanHeading title="We couldn't find that drop" text={res.ok ? "It may have been removed." : res.error} />
        <Link href="/home" className={DONE_LINK}>
          Back to Home
        </Link>
      </ScanShell>
    );
  }

  const d = res.data;
  const verified = d.status === "verified";
  const rejected = d.status === "rejected";

  return (
    <ScanShell title="Your Drop" cancelLabel="Home">
      <div className="mx-auto mt-6 flex size-[104px] items-center justify-center rounded-full bg-lime text-lime-ink shadow-[0_0_0_10px_var(--color-scan-raised)]">
        <Icon name={rejected ? "x" : "check"} size={52} strokeWidth={3} />
      </div>
      <ScanHeading
        title={rejected ? "Drop not accepted" : verified ? "Drop verified" : "Deposit received"}
        text={`${d.building} · ${d.binLabel}`}
      />
      <div className="mx-auto">
        {verified ? (
          <span className="rounded-full bg-lime px-4 py-2 text-[15px] font-semibold text-lime-ink">
            {d.kg !== null ? `${formatKg(d.kg)} · ` : ""}+{d.points} points added
          </span>
        ) : rejected ? (
          <span className="block rounded-[14px] bg-scan-raised px-4 py-2 text-center text-[15px]">
            {d.rejectReason ? `Reason: ${d.rejectReason}. ` : ""}No points were added.
          </span>
        ) : (
          <span className="flex items-center gap-2 rounded-full bg-scan-raised px-4 py-2 text-[15px]">
            <span aria-hidden="true" className="size-3.5 animate-spin rounded-full border-2 border-on-hero-muted border-t-transparent motion-reduce:animate-none" />
            Checking your scraps
          </span>
        )}
      </div>
      <ScanSteps active={verified ? 3 : 2} />
      {!verified && !rejected ? (
        <p className="text-center text-[15px] leading-snug text-on-hero-muted">
          Staff will weigh and check this drop. You earn 20 points per kg once it&apos;s verified.
        </p>
      ) : null}
      <div className="mt-auto">
        <Link href="/home" className={DONE_LINK}>
          Done
        </Link>
      </div>
    </ScanShell>
  );
}
