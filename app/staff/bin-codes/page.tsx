import type { Metadata } from "next";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { StaffPage } from "@/components/staff/StaffPage";
import { Notice } from "@/components/ui/Bits";
import { stickerUrl } from "@/lib/bins";
import { getAllBins, type BinView } from "@/lib/data/bins";
import { getStaffProfile } from "@/lib/data/staff";

export const metadata: Metadata = { title: "Bin Stickers · Nama'" };

async function origin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

async function Sticker({ bin, base }: { bin: BinView; base: string }) {
  const url = stickerUrl(base, bin.code);
  let svg = "";
  try {
    svg = await QRCode.toString(url, { type: "svg", margin: 1, color: { dark: "#0f3d2e", light: "#ffffff" } });
  } catch {
    svg = "";
  }
  return (
    <li className="flex break-inside-avoid flex-col items-center gap-2 rounded-[18px] bg-card p-5 text-center">
      {svg ? (
        <div role="img" aria-label={`QR code for ${bin.code}`} className="w-[200px] max-w-full" dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <Notice tone="error">QR code couldn&apos;t be drawn.</Notice>
      )}
      <div className="text-[22px] font-bold tracking-[2px]">{bin.code}</div>
      <div className="text-[15px] text-muted">
        {bin.building.name} · {bin.label} · {bin.building.bin_spot}
      </div>
    </li>
  );
}

export default async function BinCodesPage() {
  const profile = await getStaffProfile();
  const page = (body: React.ReactNode) => (
    <StaffPage title="Bin Stickers" backHref="/profile" wide>
      {body}
    </StaffPage>
  );

  if (!profile.ok) return page(<Notice tone="error">{profile.error}</Notice>);

  const bins = await getAllBins();
  if (!bins.ok) return page(<Notice tone="error">{bins.error}</Notice>);

  const base = await origin();
  return page(
    <>
      <p className="px-1 text-[15px] text-muted">
        Print these and stick one on each bin&apos;s lid. Residents can scan them in the app or with their phone camera.
      </p>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {bins.data.map((b) => (
          <Sticker key={b.id} bin={b} base={base} />
        ))}
      </ul>
    </>,
  );
}
