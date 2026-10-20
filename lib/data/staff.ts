import { createClient } from "@/lib/supabase/server";
import { getProfile, type ProfileView } from "@/lib/data/profile";
import { fail, NETWORK_ERROR, ok, type Result } from "@/lib/result";
import type { DepositStatus } from "@/types/database";

export const NOT_STAFF = "This page is for Nama' staff. Ask an admin to give your account staff access.";

/** Your profile, but only if you're staff. */
export async function getStaffProfile(): Promise<Result<ProfileView>> {
  const res = await getProfile();
  if (!res.ok) return res;
  return res.data.role === "staff" ? res : fail(NOT_STAFF);
}

export type StaffDrop = {
  id: string;
  userId: string;
  status: DepositStatus;
  createdAt: string;
  kg: number | null;
  points: number;
  rejectReason: string | null;
  resident: { name: string; flat: string | null };
  bin: { code: string; label: string };
  building: { id: string; name: string };
};

const SELECT =
  "id, user_id, status, created_at, weight_kg, points, reject_reason, resident:profiles!deposits_user_id_fkey(name, flat), bin:bins(code, label, building:buildings(id, name))";

type Row = {
  id: string;
  user_id: string;
  status: DepositStatus;
  created_at: string;
  weight_kg: number | null;
  points: number;
  reject_reason: string | null;
  resident: { name: string; flat: string | null } | null;
  bin: { code: string; label: string; building: { id: string; name: string } | null } | null;
};

function toDrop(r: Row): StaffDrop {
  return {
    id: r.id,
    userId: r.user_id,
    status: r.status,
    createdAt: r.created_at,
    kg: r.weight_kg === null ? null : Number(r.weight_kg),
    points: r.points,
    rejectReason: r.reject_reason,
    resident: { name: r.resident?.name ?? "Resident", flat: r.resident?.flat ?? null },
    bin: { code: r.bin?.code ?? "—", label: r.bin?.label ?? "Bin" },
    building: { id: r.bin?.building?.id ?? "", name: r.bin?.building?.name ?? "Unknown building" },
  };
}

/** Drops waiting to be weighed, oldest first. Optionally only one building's. */
export async function getPendingDrops(buildingId?: string): Promise<Result<StaffDrop[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("deposits")
      .select(SELECT)
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(200)
      .overrideTypes<Row[], { merge: false }>();
    if (error) return fail("We couldn't load the drops. Please try again.");
    const drops = data.map(toDrop);
    return ok(buildingId ? drops.filter((d) => d.building.id === buildingId) : drops);
  } catch {
    return fail(NETWORK_ERROR);
  }
}

/** One drop with the resident's details. `ok(null)` means there's no such drop. */
export async function getDropForStaff(id: string): Promise<Result<StaffDrop | null>> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return ok(null);
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("deposits")
      .select(SELECT)
      .eq("id", id)
      .overrideTypes<Row[], { merge: false }>();
    if (error) return fail("We couldn't load this drop. Please try again.");
    const row = data[0];
    return ok(row ? toDrop(row) : null);
  } catch {
    return fail(NETWORK_ERROR);
  }
}

export type StaffVoucher = {
  id: string;
  code: string;
  userId: string;
  createdAt: string;
  usedAt: string | null;
  resident: { name: string; flat: string | null };
  reward: { title: string; partner: string };
};

type VoucherRow = {
  id: string;
  code: string;
  user_id: string;
  created_at: string;
  used_at: string | null;
  resident: { name: string; flat: string | null } | null;
  reward: { title: string; partner: string } | null;
};

/** A voucher by its code, with who it belongs to. `ok(null)` means no such voucher. */
export async function getVoucherByCode(code: string): Promise<Result<StaffVoucher | null>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("redemptions")
      .select("id, code, user_id, created_at, used_at, resident:profiles!redemptions_user_id_fkey(name, flat), reward:rewards(title, partner)")
      .eq("code", code)
      .overrideTypes<VoucherRow[], { merge: false }>();
    if (error) return fail("We couldn't look up that voucher. Please try again.");
    const v = data[0];
    if (!v) return ok(null);
    return ok({
      id: v.id,
      code: v.code,
      userId: v.user_id,
      createdAt: v.created_at,
      usedAt: v.used_at,
      resident: { name: v.resident?.name ?? "Resident", flat: v.resident?.flat ?? null },
      reward: { title: v.reward?.title ?? "Reward", partner: v.reward?.partner ?? "Nama' partner" },
    });
  } catch {
    return fail(NETWORK_ERROR);
  }
}
