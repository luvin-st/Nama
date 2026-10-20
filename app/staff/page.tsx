import type { Metadata } from "next";
import { BuildingFilter } from "@/components/staff/BuildingFilter";
import { DropQueue } from "@/components/staff/DropQueue";
import { StaffPage } from "@/components/staff/StaffPage";
import { Notice } from "@/components/ui/Bits";
import { ListGroup } from "@/components/ui/List";
import { getBuildings } from "@/lib/data/buildings";
import { getPendingDrops, getStaffProfile } from "@/lib/data/staff";

export const metadata: Metadata = { title: "Check Drops · Nama'" };

type Search = { building?: string; done?: string; pts?: string };

function DoneBanner({ done, pts }: Search) {
  if (done !== "verified" && done !== "rejected") return null;
  const points = Number(pts);
  return (
    <p role="status" className="rounded-[14px] bg-lime px-4 py-3 text-center text-[15px] font-semibold text-lime-ink">
      {done === "verified" ? `Drop verified${Number.isFinite(points) ? ` · +${points} points` : ""}` : "Drop rejected · no points added"}
    </p>
  );
}

export default async function StaffQueuePage({ searchParams }: { searchParams: Promise<Search> }) {
  const search = await searchParams;
  const me = await getStaffProfile();
  if (!me.ok) {
    return (
      <StaffPage title="Check Drops" backHref="/profile">
        <ListGroup>
          <Notice tone="error">{me.error}</Notice>
        </ListGroup>
      </StaffPage>
    );
  }

  const [buildings, drops] = await Promise.all([getBuildings(), getPendingDrops(search.building)]);

  return (
    <StaffPage title="Check Drops" backHref="/profile">
      <DoneBanner {...search} />
      {buildings.ok ? <BuildingFilter buildings={buildings.data} selectedId={search.building ?? null} /> : null}
      <p className="px-1 text-[15px] text-muted">
        {drops.ok ? `${drops.data.length} waiting · oldest first` : "Drops waiting to be weighed"}
      </p>
      {drops.ok ? (
        <DropQueue drops={drops.data} myId={me.data.id} />
      ) : (
        <ListGroup>
          <Notice tone="error">{drops.error}</Notice>
        </ListGroup>
      )}
    </StaffPage>
  );
}
