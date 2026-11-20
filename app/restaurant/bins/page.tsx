import type { Metadata } from "next";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { KCard, KitchenHeader, KitchenTitle, KNotice } from "@/components/restaurant/KitchenShell";
import { getKitchenDashboard } from "@/lib/data/kitchen";
import type { Branch } from "@/lib/kitchen";

export const metadata: Metadata = { title: "Bin QR stickers · NAMA" };

async function origin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

async function Sticker({ branch, base }: { branch: Branch; base: string }) {
  let svg = "";
  try {
    svg = await QRCode.toString(`${base}/restaurant?branch=${branch.id}`, {
      type: "svg",
      margin: 1,
      color: { dark: "#1f4d3a", light: "#ffffff" },
    });
  } catch {
    svg = "";
  }
  return (
    <li className="break-inside-avoid">
      <KCard className="flex flex-col items-center gap-2 text-center">
        {svg ? (
          <div role="img" aria-label={`QR code for the ${branch.name} bins`} className="w-[180px]" dangerouslySetInnerHTML={{ __html: svg }} />
        ) : (
          <p className="py-6 text-[14px] text-k-orange">The QR code couldn&apos;t be drawn.</p>
        )}
        <p className="text-[20px] font-extrabold tracking-[0.04em] text-k-forest">NAMA 🌱 {branch.name}</p>
        <p className="text-[13px] text-k-muted">{branch.location} · Scan to log a bin</p>
      </KCard>
    </li>
  );
}

/** Printable QR stickers, one per branch: scanning one opens Log a bin with that branch picked. */
export default async function BinStickersPage() {
  const res = await getKitchenDashboard();
  if (!res.ok) return <KNotice>{res.error}</KNotice>;
  const base = await origin();

  return (
    <>
      <KitchenHeader restaurant={res.data.restaurant} />
      <KitchenTitle title="Bin QR stickers" sub="Print and stick one on each branch's bins." />
      <ul className="grid grid-cols-1 gap-4">
        {res.data.branches.map((b) => (
          <Sticker key={b.id} branch={b} base={base} />
        ))}
      </ul>
    </>
  );
}
