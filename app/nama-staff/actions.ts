"use server";

import { isGrade, type PickupGrade } from "@/lib/kitchen";
import { MAX_COLLECT_KG, MIN_COLLECT_KG, parseCollectKg } from "@/lib/nama-staff";
import { NETWORK_ERROR } from "@/lib/result";
import { createClient } from "@/lib/supabase/server";

/** On success, `stop` is what was just collected, so the screen can show it without reloading. */
export type CollectState =
  | { ok: true; message: string; at: number; stop: { branchId: number; kg: number; grade: PickupGrade; at: string } }
  | { ok: false; error: string }
  | null;

const DB_ERRORS: Record<string, string> = {
  BAD_BRANCH: "Choose a branch.",
  BAD_WEIGHT: `Enter the truck-scale weight, between ${MIN_COLLECT_KG} and ${MAX_COLLECT_KG} kg.`,
  BAD_GRADE: "Choose a grade: A, B or C.",
  NEED_REASON: "Grade C needs a reason, for example \"plastic wrap in the prep bin\".",
  BAD_REASON: "Keep the reason under 200 characters.",
  ALREADY_COLLECTED: "This branch has already been collected today.",
  NOT_ALLOWED: "Only Nama staff can record collections. Log in with a staff account.",
};

function friendly(message: string | undefined): string {
  const key = Object.keys(DB_ERRORS).find((k) => message?.includes(k));
  return (key && DB_ERRORS[key]) || "We couldn't save this collection. Please try again.";
}

/** Nama staff record one collection: branch, truck-scale weight, grade (and a reason for C). */
export async function collectPickup(_prev: CollectState, fd: FormData): Promise<CollectState> {
  const branchId = Number(fd.get("branch"));
  const branchName = String(fd.get("branchName") ?? "");
  const grade = fd.get("grade");
  const reason = String(fd.get("reason") ?? "").trim();
  if (!Number.isInteger(branchId) || branchId < 1) return { ok: false, error: DB_ERRORS.BAD_BRANCH ?? "" };
  const kg = parseCollectKg(String(fd.get("weight") ?? ""));
  if (kg === null) return { ok: false, error: `${DB_ERRORS.BAD_WEIGHT} For example 42.5` };
  if (!isGrade(grade)) return { ok: false, error: DB_ERRORS.BAD_GRADE ?? "" };
  if (grade === "C" && reason.length < 3) return { ok: false, error: DB_ERRORS.NEED_REASON ?? "" };
  if (reason.length > 200) return { ok: false, error: DB_ERRORS.BAD_REASON ?? "" };

  try {
    const supabase = await createClient();
    const { error } = await supabase.rpc("kitchen_collect", {
      p_branch_id: branchId,
      p_kg: kg,
      p_grade: grade,
      p_reason: reason || null,
    });
    if (error) return { ok: false, error: friendly(error.message) };
  } catch {
    return { ok: false, error: NETWORK_ERROR };
  }

  const at = Date.now();
  return {
    ok: true,
    message: `Collected ${kg} kg at ${branchName}, grade ${grade}`,
    at,
    stop: { branchId, kg, grade, at: new Date(at).toISOString() },
  };
}
