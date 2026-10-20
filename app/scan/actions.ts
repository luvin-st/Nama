"use server";

import { redirect } from "next/navigation";
import { parseBinCode } from "@/lib/bins";
import { getBinByCode } from "@/lib/data/bins";
import { NETWORK_ERROR } from "@/lib/result";
import { createClient } from "@/lib/supabase/server";

export type DepositState = { error?: string } | null;

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

/** Creates a pending deposit at the scanned bin. Points are added later, after staff verify it. */
export async function createDeposit(_prev: DepositState, fd: FormData): Promise<DepositState> {
  const code = parseBinCode(String(fd.get("bin") ?? ""));
  if (!code) return { error: "That code doesn't match a Nama' bin. Codes look like NAMA-B02." };

  let depositId: string;
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return { error: "You're signed out. Log in again to continue." };

    const [binRes, profileRes] = await Promise.all([
      getBinByCode(code),
      supabase.from("profiles").select("building_id, building:buildings(name)").eq("id", auth.user.id).single(),
    ]);
    if (!binRes.ok) return { error: binRes.error };
    if (!binRes.data) return { error: "That code doesn't match a Nama' bin. Codes look like NAMA-B02." };
    if (profileRes.error) return { error: "We couldn't load your profile. Please try again." };

    const bin = binRes.data;
    if (profileRes.data.building_id !== bin.building.id) {
      const mine = profileRes.data.building?.name ?? "no building";
      return { error: `This bin is at ${bin.building.name}. You're registered at ${mine}.` };
    }

    const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();
    const { data: recent, error: recentError } = await supabase
      .from("deposits")
      .select("id")
      .eq("user_id", auth.user.id)
      .eq("bin_id", bin.id)
      .eq("status", "pending")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (recentError) return { error: "We couldn't save your drop. Please try again." };

    if (recent) {
      depositId = recent.id;
    } else {
      const { data: created, error: insertError } = await supabase
        .from("deposits")
        .insert({ bin_id: bin.id })
        .select("id")
        .single();
      if (insertError || !created) return { error: "We couldn't save your drop. Please try again." };
      depositId = created.id;
    }
  } catch {
    return { error: NETWORK_ERROR };
  }

  redirect(`/scan/done/${depositId}`);
}
