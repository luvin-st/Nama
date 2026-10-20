import { createClient } from "@/lib/supabase/server";
import { fail, NETWORK_ERROR, ok, type Result } from "@/lib/result";
import type { Role, Tables } from "@/types/database";

export type ProfileView = {
  id: string;
  name: string;
  email: string;
  flat: string | null;
  role: Role;
  showOnLeaderboard: boolean;
  building: Pick<Tables<"buildings">, "id" | "name" | "pickup_day" | "bin_spot"> | null;
};

/** The signed-in resident's profile, with their building. */
export async function getProfile(): Promise<Result<ProfileView>> {
  try {
    const supabase = await createClient();
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth.user) return fail("You're signed out. Log in again to continue.");

    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, flat, role, show_on_leaderboard, building:buildings(id, name, pickup_day, bin_spot)")
      .eq("id", auth.user.id)
      .single();
    if (error || !data) return fail("We couldn't load your profile. Please try again.");

    const { show_on_leaderboard, ...rest } = data;
    return ok({ ...rest, showOnLeaderboard: show_on_leaderboard, email: auth.user.email ?? "" });
  } catch {
    return fail(NETWORK_ERROR);
  }
}

/** "Shaden Taha" → "ST" */
export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
