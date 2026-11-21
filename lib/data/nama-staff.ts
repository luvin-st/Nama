import { isGrade, isWasteType, type WasteType } from "@/lib/kitchen";
import type { Collection, StaffRoute, Stop } from "@/lib/nama-staff";
import { fail, NETWORK_ERROR, ok, type Result } from "@/lib/result";
import { createClient } from "@/lib/supabase/server";
import { isObj, list, num, str, toBooking, type Obj }  from "./json";

function toStop(o: Obj): Stop {
  const byType: Partial<Record<WasteType, number>> = {};
  if (isObj(o.byType)) {
    for (const [k, v] of Object.entries(o.byType)) if (isWasteType(k)) byType[k] = num(v);
  }
  const c = isObj(o.collected) ? o.collected : null;
  return {
    branchId: num(o.branchId),
    name: str(o.name),
    location: str(o.location),
    todayKg: num(o.todayKg),
    byType,
    collected: c ? { kg: num(c.kg), grade: isGrade(c.grade) ? c.grade : null, at: str(c.at) } : null,
  };
}

function toCollection(o: Obj): Collection {
  return {
    id: num(o.id),
    collectedKg: num(o.collectedKg),
    collectedAt: str(o.collectedAt),
    grade: isGrade(o.grade) ? o.grade : null,
    reason: str(o.reason) || null,
    collectedBy: str(o.collectedBy) || null,
    branch: str(o.branch) || null,
  };
}

/** Today's route for Nama staff, from the kitchen_staff_route() database function. */
export async function getStaffRoute(): Promise<Result<StaffRoute>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("kitchen_staff_route");
    if (error || !isObj(data)) return fail("We couldn't load today's route. Please try again.");
    return ok({
      restaurant: str(data.restaurant),
      nextPickup: str(data.nextPickup),
      openRequest: typeof data.openRequest === "string" ? data.openRequest : null,
      booking: toBooking(data.booking),
      stops: list(data.stops).map(toStop),
      collected: list(data.collected).map(toCollection),
    });
  } catch {
    return fail(NETWORK_ERROR);
  }
}
