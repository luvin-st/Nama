"use server";

import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { safeNext } from "@/lib/next-path";
import { isSide, nextForSide, SIDE, type Side } from "@/lib/portal";
import { NETWORK_ERROR } from "@/lib/result";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type PortalState = { error?: string; message?: string } | null;

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const isEmail = (s: string) => /^\S+@\S+\.\S+$/.test(s);

function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("already registered") || m.includes("already exists")) return "An account with this email already exists. Log in instead.";
  if (m.includes("invalid login")) return "That email and password don't match. Check them and try again.";
  if (m.includes("email not confirmed")) return "Confirm your email first. Check your inbox for the link we sent.";
  if (m.includes("password")) return "Use a password with at least 8 characters.";
  if (m.includes("rate limit")) return "Too many attempts. Wait a minute and try again.";
  return "Something went wrong. Please try again.";
}

const JOIN_ERRORS: Record<string, string> = {
  BAD_CODE: "That staff code isn't right. Ask your manager for it.",
  BAD_COMPANY: "Enter your company name.",
};

/**
 * Makes sure the account is on a side. New accounts carry the side they chose in their sign-up
 * details; the database checks it (and the staff code) and records it once.
 */
async function joinSide(supabase: SupabaseClient<Database>, user: User): Promise<{ side: Side } | { error: string }> {
  const { data: role, error } = await supabase.rpc("kitchen_my_role");
  if (error) return { error: "We couldn't check your account. Please try again." };
  if (isSide(role)) return { side: role };

  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const kind = meta.nama_kind;
  if (!isSide(kind)) return { error: "This account isn't set up for Nama' yet. Create an account instead." };

  const company = typeof meta.nama_company === "string" ? meta.nama_company : null;
  const code = typeof meta.nama_code === "string" ? meta.nama_code : null;
  const { data: joined, error: joinError } = await supabase.rpc("kitchen_join", { p_kind: kind, p_company: company, p_code: code });
  if (joinError || !isSide(joined)) {
    const key = Object.keys(JOIN_ERRORS).find((k) => joinError?.message.includes(k));
    return { error: (key && JOIN_ERRORS[key]) || "We couldn't set up your account. Please try again." };
  }
  // The staff code was only kept until it had been checked.
  if (code) await supabase.auth.updateUser({ data: { nama_code: null } });
  return { side: joined };
}

export async function portalSignIn(_prev: PortalState, fd: FormData): Promise<PortalState> {
  const email = text(fd, "email");
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  let side: Side;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return { error: friendlyAuthError(error?.message ?? "") };
    const res = await joinSide(supabase, data.user);
    if ("error" in res) {
      await supabase.auth.signOut();
      return { error: res.error };
    }
    side = res.side;
  } catch {
    return { error: NETWORK_ERROR };
  }
  redirect(nextForSide(side, safeNext(fd.get("next"))));
}

function checkSignup(side: Side, fd: FormData): string | null {
  const name = text(fd, "name");
  if (!name || name.length > 60) return "Enter your name (up to 60 characters).";
  if (side === "restaurant") {
    const company = text(fd, "company");
    if (!company || company.length > 80) return "Enter your company name (up to 80 characters).";
  }
  if (!isEmail(text(fd, "email"))) return "Enter a valid email address.";
  if (String(fd.get("password") ?? "").length < 8) return "Use a password with at least 8 characters.";
  if (side === "staff" && !text(fd, "code")) return "Enter the staff code.";
  return null;
}

export async function portalSignUp(_prev: PortalState, fd: FormData): Promise<PortalState> {
  const side = fd.get("side");
  if (!isSide(side)) return { error: "Something went wrong. Please try again." };
  const problem = checkSignup(side, fd);
  if (problem) return { error: problem };

  const email = text(fd, "email");
  const code = side === "staff" ? text(fd, "code") : null;
  const company = side === "restaurant" ? text(fd, "company") : null;

  try {
    const supabase = await createClient();
    if (code) {
      // Checked first, so a wrong code doesn't leave an account behind.
      const { data: good, error } = await supabase.rpc("kitchen_check_staff_code", { p_code: code });
      if (error) return { error: "We couldn't check the staff code. Please try again." };
      if (!good) return { error: JOIN_ERRORS.BAD_CODE };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password: String(fd.get("password") ?? ""),
      options: { data: { name: text(fd, "name"), nama_kind: side, nama_company: company, nama_code: code } },
    });
    if (error || !data.user) return { error: friendlyAuthError(error?.message ?? "") };
    if (!data.session) {
      return { message: `Check your inbox. We sent a confirmation link to ${email}. Open it, then log in here.` };
    }
    const res = await joinSide(supabase, data.user);
    if ("error" in res) return { error: res.error };
  } catch {
    return { error: NETWORK_ERROR };
  }
  redirect(SIDE[side].home);
}

export async function portalSignOut(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Even if the network call fails, go back to the portal.
  }
  redirect("/");
}
