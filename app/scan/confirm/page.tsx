import type { Metadata } from "next";
import Link from "next/link";
import { ConfirmDrop } from "@/components/scan/ConfirmDrop";
import { ScanHeading, ScanShell } from "@/components/scan/ScanShell";
import { ScanSteps } from "@/components/scan/ScanSteps";
import { Icon } from "@/components/ui/Icon";
import { parseBinCode } from "@/lib/bins";
import { getBinByCode } from "@/lib/data/bins";

export const metadata: Metadata = { title: "Bin Found · Nama'" };

function Problem({ message }: { message: string }) {
  return (
    <ScanShell title="Scan Bin">
      <ScanHeading title="We couldn't use that code" text={message} />
      <Link href="/scan" className="flex h-[52px] items-center justify-center rounded-[14px] bg-lime text-[17px] font-semibold text-lime-ink">
        Scan Again
      </Link>
    </ScanShell>
  );
}

export default async function ConfirmPage({ searchParams }: { searchParams: Promise<{ bin?: string }> }) {
  const { bin } = await searchParams;
  const code = parseBinCode(bin ?? "");
  if (!code) return <Problem message="That code doesn't match a Nama' bin. Codes look like NAMA-B02." />;

  const res = await getBinByCode(code);
  if (!res.ok) return <Problem message={res.error} />;
  if (!res.data) return <Problem message={`There's no Nama' bin with the code ${code}.`} />;

  const b = res.data;
  return (
    <ScanShell title="Drop Scraps" cancelHref="/scan" cancelLabel="Back">
      <div className="mx-auto mt-4 flex size-[84px] items-center justify-center rounded-full bg-lime text-lime-ink shadow-[0_0_0_10px_var(--color-scan-raised)]">
        <Icon name="check" size={42} strokeWidth={3} />
      </div>
      <ScanHeading title="Bin found" text={`${b.building.name} · ${b.label} · ${b.building.bin_spot}`} />
      <ScanSteps active={1} />
      <p className="text-center text-[15px] leading-snug text-on-hero-muted">
        Open the lid and empty your caddy. Staff weigh and check each drop, then your points are added.
      </p>
      <div className="mt-auto">
        <ConfirmDrop code={b.code} />
      </div>
    </ScanShell>
  );
}
