import { Icon } from "@/components/ui/Icon";
import type { MyImpact } from "@/lib/data/impact";
import { formatKg } from "@/lib/format";
import { co2ForKg } from "@/lib/impact";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex-1 rounded-[14px] bg-hero-2 px-3 py-2.5">
      <div className="text-[20px] font-bold leading-tight tabular-nums">{value}</div>
      <div className="text-[13px] text-on-hero-muted">{label}</div>
    </div>
  );
}

/** Dark green card: everything you've composted so far. */
export function MyImpactCard({ me }: { me: MyImpact }) {
  return (
    <section aria-label="Your impact" className="rounded-[22px] bg-hero p-5 text-on-hero">
      <div className="flex items-center gap-2 text-[15px] font-medium text-on-hero-muted">
        <Icon name="sprout" size={16} strokeWidth={2.2} className="text-lime" />
        You&apos;ve composted
      </div>
      <div className="mt-1 text-[48px] font-bold leading-none tracking-[-1px] tabular-nums">{formatKg(me.totalKg)}</div>
      <p className="mt-2 text-[15px] text-on-hero-muted">
        {me.totalKg > 0 ? "of food scraps kept out of landfill" : "Your first verified drop will show up here"}
      </p>
      <div className="mt-4 flex gap-2">
        <Stat label="CO₂ avoided*" value={`≈ ${formatKg(co2ForKg(me.totalKg))}`} />
        <Stat label="Verified drops" value={String(me.verifiedDrops)} />
      </div>
    </section>
  );
}
