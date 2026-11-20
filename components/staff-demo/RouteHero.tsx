import { Pill } from "@/components/ui/Bits";
import { Icon } from "@/components/ui/Icon";
import { formatKg } from "@/lib/format";
import { clockTime, weekdayDate } from "@/lib/kitchen";
import type { StaffRoute } from "@/lib/nama-staff";

/** Dark summary card: how many stops are left and how much the kitchens logged today. */
export function RouteHero({ route }: { route: StaffRoute }) {
  const left = route.stops.filter((s) => !s.collected).length;
  const logged = route.stops.reduce((sum, s) => sum + s.todayKg, 0);
  const today = new Date().toISOString();

  return (
    <section aria-label="Today" className="rounded-[22px] bg-hero p-5 text-on-hero">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-[15px] font-medium text-on-hero-muted">
          <Icon name="calendar" size={18} /> {weekdayDate(today)}
        </span>
        {route.openRequest ? <Pill>Pickup requested {clockTime(route.openRequest)}</Pill> : null}
      </div>
      <p className="mt-2 text-[30px] font-bold leading-tight tracking-[-0.4px]">
        {left === 0 ? "All stops collected" : `${left} of ${route.stops.length} stops to go`}
      </p>
      <p className="mt-2 text-[13px] text-on-hero-muted">
        {formatKg(logged)} logged by the kitchens today · Regular pickup {route.nextPickup}
      </p>
    </section>
  );
}
