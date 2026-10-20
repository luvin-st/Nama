"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NETWORK_ERROR } from "@/lib/result";

export type FormState = { error?: string; message?: string } | null;

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("already registered") || m.includes("already exists")) return "An account with this email already exists. Log in instead.";
  if (m.includes("invalid login")) return "That email and password don't match. Check them and try again.";
  if (m.includes("email not confirmed")) return "Confirm your email first. Check your inbox for the link we sent.";
  if (m.includes("password")) return "Use a password with at least 8 characters.";
  if (m.includes("rate limit")) return "Too many attempts. Wait a minute and try again.";
  return "Something went wrong. Please try again.";
}

export async function signUp(_prev: FormState, fd: FormData): Promise<FormState> {
  const name = text(fd, "name");
  const email = text(fd, "email");
  const password = String(fd.get("password") ?? "");
  const buildingId = text(fd, "building_id");
  const flat = text(fd, "flat");

  if (!name) return { error: "Enter your name." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Enter a valid email address." };
  if (password.length < 8) return { error: "Use a password with at least 8 characters." };
  if (!buildingId) return { error: "Choose your building." };
  if (!/^\d{1,6}$/.test(flat)) return { error: "Enter your flat number using digits only." };
  if (fd.get("agree") !== "on") return { error: "Tick the box to confirm you'll only put food scraps in the bin." };

  let needsConfirmation = false;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, building_id: buildingId, flat } },
    });
    if (error) return { error: friendlyAuthError(error.message) };
    needsConfirmation = !data.session;
  } catch {
    return { error: NETWORK_ERROR };
  }

  if (needsConfirmation) {
    return { message: `Check your inbox. We sent a confirmation link to ${email}. Open it, then log in.` };
  }
  redirect("/home");
}

export async function signIn(_prev: FormState, fd: FormData): Promise<FormState> {
  const email = text(fd, "email");
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: friendlyAuthError(error.message) };
  } catch {
    return { error: NETWORK_ERROR };
  }
  redirect("/home");
}

export async function signOut(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    // Even if the network call fails, send the person back to the start.
  }
  redirect("/welcome");
}
