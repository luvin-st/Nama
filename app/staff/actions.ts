"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isRejectReason } from "@/lib/drops";
import { MAX_KG, MIN_KG, parseKg } from "@/lib/points";
import { NETWORK_ERROR } from "@/lib/result";
import { createClient } from "@/lib/supabase/server";

export type StaffFormState = { error?: string } | null;

const DB_ERRORS: Record<string, string> = {
  NOT_STAFF: "Only Nama' staff can check drops.",
  OWN_DROP: "You can't check your own drop. Another staff member needs to do it.",
  NOT_PENDING: "This drop was already checked.",
  NOT_FOUND: "We couldn't find this drop. It may have been removed.",
  BAD_WEIGHT: `Enter a weight between ${MIN_KG} and ${MAX_KG} kg.`,
  BAD_REASON: "Choose a reason for rejecting this drop.",
};

function friendly(message: string | undefined): string {
  const key = Object.keys(DB_ERRORS).find((k) => message?.includes(k));
  return key ? (DB_ERRORS[key] ?? NETWORK_ERROR) : "We couldn't save this. Please try again.";
}

function dropId(fd: FormData): string | null {
  const id = String(fd.get("id") ?? "");
  return /^[0-9a-f-]{36}$/i.test(id) ? id : null;
}

/** Saves the weight and adds the points (worked out by the database). */
export async function verifyDrop(_prev: StaffFormState, fd: FormData): Promise<StaffFormState> {
  const id = dropId(fd);
  if (!id) return { error: DB_ERRORS.NOT_FOUND };
  const kg = parseKg(String(fd.get("weight") ?? ""));
  if (kg === null) return { error: `${DB_ERRORS.BAD_WEIGHT} For example 1.4` };

  let points: number;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("verify_deposit", { p_id: id, p_weight: kg });
    if (error) return { error: friendly(error.message) };
    points = data;
  } catch {
    return { error: NETWORK_ERROR };
  }

  revalidatePath("/staff");
  redirect(`/staff?done=verified&pts=${points}`);
}

/** Marks the drop as not accepted, with a reason the resident can see. */
export async function rejectDrop(_prev: StaffFormState, fd: FormData): Promise<StaffFormState> {
  const id = dropId(fd);
  if (!id) return { error: DB_ERRORS.NOT_FOUND };
  const reason = String(fd.get("reason") ?? "");
  if (!isRejectReason(reason)) return { error: DB_ERRORS.BAD_REASON };

  try {
    const supabase = await createClient();
    const { error } = await supabase.rpc("reject_deposit", { p_id: id, p_reason: reason });
    if (error) return { error: friendly(error.message) };
  } catch {
    return { error: NETWORK_ERROR };
  }

  revalidatePath("/staff");
  redirect("/staff?done=rejected");
}
