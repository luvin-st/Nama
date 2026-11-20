"use server";

import { isWasteType, MAX_LOG_KG, MIN_LOG_KG, parseLogKg, WASTE } from "@/lib/kitchen";
import { NETWORK_ERROR } from "@/lib/result";
import { createClient } from "@/lib/supabase/server";

export type LogState = { ok: true; message: string; at: number } | { ok: false; error: string } | null;
export type SimpleState = { error?: string; done?: number } | null;

const DB_ERRORS: Record<string, string> = {
  BAD_BRANCH: "Choose a branch.",
  BAD_TYPE: "Choose what kind of waste it is.",
  BAD_WEIGHT: `Enter a weight between ${MIN_LOG_KG} and ${MAX_LOG_KG} kg.`,
  TOO_MANY: "Lots of bins were logged in the last hour. Please wait a bit and try again.",
};

function friendly(message: string | undefined): string {
  const key = Object.keys(DB_ERRORS).find((k) => message?.includes(k));
  return key ? (DB_ERRORS[key] ?? NETWORK_ERROR) : "We couldn't save this. Please try again.";
}

// These actions don't revalidate on the server. The screen calls router.refresh() itself once an
// action has answered: revalidating inside the action left the button stuck on "Saving…" when the
// page was scrolled (production build).

/** Kitchen staff log one bin: branch, waste type and weight. */
export async function logBin(_prev: LogState, fd: FormData): Promise<LogState> {
  const branchId = Number(fd.get("branch"));
  const branchName = String(fd.get("branchName") ?? "");
  const type = String(fd.get("type") ?? "");
  if (!Number.isInteger(branchId) || branchId < 1) return { ok: false, error: DB_ERRORS.BAD_BRANCH ?? "" };
  if (!isWasteType(type)) return { ok: false, error: DB_ERRORS.BAD_TYPE ?? "" };
  const kg = parseLogKg(String(fd.get("weight") ?? ""));
  if (kg === null) return { ok: false, error: `${DB_ERRORS.BAD_WEIGHT} For example 4.5` };

  try {
    const supabase = await createClient();
    const { error } = await supabase.rpc("kitchen_log_bin", { p_branch_id: branchId, p_waste_type: type, p_weight_kg: kg });
    if (error) return { ok: false, error: friendly(error.message) };
  } catch {
    return { ok: false, error: NETWORK_ERROR };
  }

  return { ok: true, message: `Saved: ${kg} kg ${WASTE[type].label.toLowerCase()} at ${branchName}`, at: Date.now() };
}

/** "Bins full: request pickup". */
export async function requestPickup(): Promise<SimpleState> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.rpc("kitchen_request_pickup");
    if (error) return { error: "We couldn't send the request. Please try again." };
  } catch {
    return { error: NETWORK_ERROR };
  }
  return { done: Date.now() };
}

/** Puts the demo back to the 15 sample logs (AED 7,480). */
export async function resetDemo(): Promise<SimpleState> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.rpc("kitchen_reset_demo");
    if (error) return { error: "We couldn't reset the demo. Please try again." };
  } catch {
    return { error: NETWORK_ERROR };
  }
  return { done: Date.now() };
}
