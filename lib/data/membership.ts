import { createClient } from "@/lib/supabase/server";
import { isSide, type Side } from "@/lib/portal";
import { fail, NETWORK_ERROR, ok, type Result } from "@/lib/result";

/** The logged-in person. `side` is null for an account that isn't set up for Nama' yet. */
export type Membership = { email: string; name: string; side: Side | null };

/** Who is logged in and which side they're on. ok(null) means nobody is logged in. */
export async function getMembership(): Promise<Result<Membership | null>> {
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return ok(null);

    const { data: role, error } = await supabase.rpc("kitchen_my_role");
    if (error) return fail("We couldn't check your account. Please try again.");
    const meta = user.user_metadata as Record<string, unknown> | undefined;
    const name = typeof meta?.name === "string" ? meta.name : "";
    return ok({ email: user.email ?? "", name, side: isSide(role) ? role : null });
  } catch {
    return fail(NETWORK_ERROR);
  }
}
