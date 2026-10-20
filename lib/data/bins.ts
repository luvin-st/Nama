import { createClient } from "@/lib/supabase/server";
import { fail, NETWORK_ERROR, ok, type Result } from "@/lib/result";

export type BinView = {
  id: string;
  code: string;
  label: string;
  building: { id: string; name: string; bin_spot: string };
};

/** One bin by its code, with its building. `ok(null)` means no such bin. */
export async function getBinByCode(code: string): Promise<Result<BinView | null>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("bins")
      .select("id, code, label, building:buildings(id, name, bin_spot)")
      .eq("code", code)
      .maybeSingle();
    if (error) return fail("We couldn't look up that bin. Please try again.");
    if (!data || !data.building) return ok(null);
    return ok({ id: data.id, code: data.code, label: data.label, building: data.building });
  } catch {
    return fail(NETWORK_ERROR);
  }
}

/** All bins, A–Z by code, for the staff sticker sheet. */
export async function getAllBins(): Promise<Result<BinView[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("bins")
      .select("id, code, label, building:buildings(id, name, bin_spot)")
      .order("code");
    if (error) return fail("We couldn't load the bins. Please try again.");
    return ok(
      data.flatMap((b) => (b.building ? [{ id: b.id, code: b.code, label: b.label, building: b.building }] : [])),
    );
  } catch {
    return fail(NETWORK_ERROR);
  }
}
