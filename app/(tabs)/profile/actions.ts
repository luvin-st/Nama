"use server";

import { revalidatePath } from "next/cache";
import { NETWORK_ERROR } from "@/lib/result";
import { createClient } from "@/lib/supabase/server";

export type ToggleState = { error?: string; value: boolean };

/** Shows or hides you on your building's neighbours leaderboard. */
export async function setLeaderboardVisibility(prev: ToggleState, fd: FormData): Promise<ToggleState> {
  const value = fd.get("show") === "on";
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return { value: prev.value, error: "You're signed out. Log in again to continue." };
    const { error } = await supabase.from("profiles").update({ show_on_leaderboard: value }).eq("id", auth.user.id);
    if (error) return { value: prev.value, error: "We couldn't save that. Please try again." };
  } catch {
    return { value: prev.value, error: NETWORK_ERROR };
  }
  revalidatePath("/impact");
  revalidatePath("/profile");
  return { value };
}
