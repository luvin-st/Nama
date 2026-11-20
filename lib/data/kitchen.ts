import { createClient } from "@/lib/supabase/server";
import { fail, NETWORK_ERROR, ok, type Result } from "@/lib/result";
import { isWasteType, type BinLog, type Branch, type KitchenDashboard, type Pickup } from "@/lib/kitchen";

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
const num = (v: unknown): number => (typeof v === "number" ? v : Number(v ?? 0)) || 0;
const str = (v: unknown): string => (typeof v === "string" ? v : "");
const list = (v: unknown): Obj[] => (Array.isArray(v) ? v.filter(isObj) : []);

function toBranch(o: Obj): Branch {
  return { id: num(o.id), name: str(o.name), location: str(o.location), monthKg: num(o.monthKg) };
}

function toLog(o: Obj): BinLog | null {
  const t = str(o.wasteType);
  if (!isWasteType(t)) return null;
  return { id: num(o.id), branch: str(o.branch), wasteType: t, weightKg: num(o.weightKg), loggedAt: str(o.loggedAt) };
}

function toPickup(o: Obj): Pickup {
  return { id: num(o.id), collectedKg: num(o.collectedKg), collectedAt: str(o.collectedAt) };
}

/** Everything the restaurant screens need, from the kitchen_dashboard() database function. */
export async function getKitchenDashboard(): Promise<Result<KitchenDashboard>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("kitchen_dashboard");
    if (error || !isObj(data)) return fail("We couldn't load the restaurant data. Please try again.");

    const byType = isObj(data.byType) ? data.byType : {};
    return ok({
      restaurant: str(data.restaurant),
      aedPerKg: num(data.aedPerKg),
      nextPickup: str(data.nextPickup),
      tip: str(data.tip),
      branches: list(data.branches).map(toBranch),
      byType: { prep: num(byType.prep), spoilage: num(byType.spoilage), plate: num(byType.plate) },
      logCount: num(data.logCount),
      recentLogs: list(data.recentLogs).map(toLog).filter((l): l is BinLog => l !== null),
      pickups: list(data.pickups).map(toPickup),
      openRequest: typeof data.openRequest === "string" ? data.openRequest : null,
    });
  } catch {
    return fail(NETWORK_ERROR);
  }
}
