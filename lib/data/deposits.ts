import { createClient } from "@/lib/supabase/server";
import { fail, NETWORK_ERROR, ok, type Result } from "@/lib/result";
import type { DepositStatus } from "@/types/database";

export type DepositView = {
  id: string;
  status: DepositStatus;
  kg: number | null;
  points: number;
  rejectReason: string | null;
  createdAt: string;
  binLabel: string;
  building: string;
};

/** One of your own deposits. `ok(null)` means it doesn't exist (or isn't yours). */
export async function getDeposit(id: string): Promise<Result<DepositView | null>> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return ok(null);
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("deposits")
      .select("id, status, weight_kg, points, reject_reason, created_at, bin:bins(label, building:buildings(name))")
      .eq("id", id)
      .maybeSingle();
    if (error) return fail("We couldn't load your drop. Please try again.");
    if (!data) return ok(null);
    return ok({
      id: data.id,
      status: data.status,
      kg: data.weight_kg === null ? null : Number(data.weight_kg),
      points: data.points,
      rejectReason: data.reject_reason,
      createdAt: data.created_at,
      binLabel: data.bin?.label ?? "Bin",
      building: data.bin?.building?.name ?? "Your building",
    });
  } catch {
    return fail(NETWORK_ERROR);
  }
}
