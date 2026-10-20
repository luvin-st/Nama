import QRCode from "qrcode";
import { Pill } from "@/components/ui/Bits";
import type { VoucherView } from "@/lib/data/rewards";

const DATE = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", day: "numeric", month: "short", year: "numeric" });

/** The voucher to show at the counter: big code plus a QR of it. */
export async function VoucherCard({ voucher }: { voucher: VoucherView }) {
  let svg = "";
  try {
    svg = await QRCode.toString(voucher.code, { type: "svg", margin: 1, color: { dark: "#0f3d2e", light: "#ffffff" } });
  } catch {
    svg = "";
  }
  const used = voucher.usedAt !== null;

  return (
    <section aria-label="Your voucher" className="flex flex-col items-center gap-3 rounded-[22px] bg-card px-5 py-6 text-center">
      {used ? <Pill tone="wait">Used {DATE.format(new Date(voucher.usedAt ?? ""))}</Pill> : <Pill>Ready to use</Pill>}
      <h2 className="text-balance text-[22px] font-bold">{voucher.reward.title}</h2>
      <p className="-mt-2 text-[15px] text-muted">{voucher.reward.partner}</p>
      {svg ? (
        <div
          role="img"
          aria-label={`QR code for voucher ${voucher.code}`}
          className={`w-[200px] max-w-full overflow-hidden rounded-xl bg-white p-2 ${used ? "opacity-30" : ""}`}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : null}
      <div className={`font-mono text-[26px] font-bold tracking-[2px] tabular-nums ${used ? "text-muted line-through" : ""}`}>
        {voucher.code}
      </div>
      <p className="text-[15px] leading-snug text-muted">
        {used ? "This voucher has been used." : "Show this at the counter. It can be used once."}
        <br />
        Redeemed {DATE.format(new Date(voucher.createdAt))} for {voucher.pointsSpent} points
      </p>
    </section>
  );
}
