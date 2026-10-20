import { createClient } from "@/lib/supabase/server";
import { fail, NETWORK_ERROR, ok, type Result } from "@/lib/result";
import type { Tables } from "@/types/database";

export type BuildingOption = Pick<Tables<"buildings">, "id" | "name">;

/** Buildings shown on the sign-up form, A–Z. */
export async function getBuildings(): Promise<Result<BuildingOption[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("buildings").select("id, name").order("name");
    if (error) return fail("We couldn't load the list of buildings. Please try again.");
    return ok(data);
  } catch {
    return fail(NETWORK_ERROR);
  }
}
