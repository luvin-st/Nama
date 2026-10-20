import type { Metadata } from "next";
import { signOut } from "@/app/(auth)/actions";
import { Notice, ScreenHeader } from "@/components/ui/Bits";
import { GroupLabel, ListGroup, ListRow } from "@/components/ui/List";
import { getProfile, initials } from "@/lib/data/profile";

export const metadata: Metadata = { title: "Profile · Nama'" };

export default async function ProfilePage() {
  const profile = await getProfile();

  if (!profile.ok) {
    return (
      <>
        <ScreenHeader title="Profile" />
        <div className="rounded-[14px] bg-card">
          <Notice tone="error">{profile.error}</Notice>
        </div>
      </>
    );
  }

  const p = profile.data;
  const value = (v: string) => <span className="text-[17px] text-muted">{v}</span>;

  return (
    <>
      <div className="flex flex-col items-center gap-2 pt-4">
        <span className="flex size-16 items-center justify-center rounded-full bg-lime text-[24px] font-semibold text-lime-ink">
          {initials(p.name)}
        </span>
        <h1 className="text-[22px] font-bold">{p.name}</h1>
        {p.role === "staff" ? <span className="text-[13px] text-muted">Nama&apos; staff</span> : null}
      </div>
      <GroupLabel>Home</GroupLabel>
      <ListGroup>
        <ListRow title="Building" trailing={value(p.building?.name ?? "Not set")} />
        <ListRow title="Flat" trailing={value(p.flat ?? "Not set")} />
        <ListRow title="Pickup day" trailing={value(p.building?.pickup_day ?? "—")} />
      </ListGroup>
      <GroupLabel>Account</GroupLabel>
      <ListGroup>
        <ListRow title="Email" trailing={value(p.email)} />
      </ListGroup>
      <form action={signOut}>
        <ListGroup>
          <button type="submit" className="w-full px-4 py-3 text-center text-[17px] text-danger">
            Sign Out
          </button>
        </ListGroup>
      </form>
    </>
  );
}
