import type { Metadata } from "next";
import { RejectForm } from "@/components/staff/RejectForm";
import { StaffPage } from "@/components/staff/StaffPage";
import { WeighForm } from "@/components/staff/WeighForm";
import { Notice, Pill } from "@/components/ui/Bits";
import { GroupLabel, ListGroup, ListRow } from "@/components/ui/List";
import { getDropForStaff, getStaffProfile, type StaffDrop } from "@/lib/data/staff";
import { formatKg, relativeDay } from "@/lib/format";

export const metadata: Metadata = { title: "Check Drop · Nama'" };

const value = (v: string) => <span className="text-[17px] text-muted">{v}</span>;

function Details({ d }: { d: StaffDrop }) {
  const time = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", hour: "2-digit", minute: "2-digit" }).format(new Date(d.createdAt));
  return (
    <ListGroup>
      <ListRow title="Resident" trailing={value(d.resident.name)} />
      <ListRow title="Flat" trailing={value(d.resident.flat ?? "—")} />
      <ListRow title="Building" trailing={value(d.building.name)} />
      <ListRow title="Bin" trailing={value(`${d.bin.label} · ${d.bin.code}`)} />
      <ListRow title="Dropped" trailing={value(`${relativeDay(d.createdAt)}, ${time}`)} />
    </ListGroup>
  );
}

function Outcome({ d }: { d: StaffDrop }) {
  return (
    <ListGroup>
      <ListRow
        title={d.status === "verified" ? `${d.kg !== null ? formatKg(d.kg) : "Drop"} · +${d.points} points` : `Not accepted · ${d.rejectReason ?? "no reason given"}`}
        trailing={<Pill tone={d.status === "verified" ? "ok" : "bad"}>{d.status === "verified" ? "Verified" : "Rejected"}</Pill>}
      />
    </ListGroup>
  );
}

export default async function CheckDropPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const me = await getStaffProfile();
  const page = (body: React.ReactNode) => (
    <StaffPage title="Check Drop" backHref="/staff">
      {body}
    </StaffPage>
  );
  const problem = (msg: string) =>
    page(
      <ListGroup>
        <Notice tone="error">{msg}</Notice>
      </ListGroup>,
    );

  if (!me.ok) return problem(me.error);
  const res = await getDropForStaff(id);
  if (!res.ok) return problem(res.error);
  if (!res.data) return problem("We couldn't find this drop. It may have been removed.");

  const d = res.data;
  const mine = d.userId === me.data.id;

  return page(
    <>
      <Details d={d} />
      {d.status !== "pending" ? (
        <>
          <GroupLabel>Already checked</GroupLabel>
          <Outcome d={d} />
        </>
      ) : mine ? (
        <ListGroup>
          <Notice>You can&apos;t check your own drop. Another staff member needs to do it.</Notice>
        </ListGroup>
      ) : (
        <>
          <GroupLabel>Weigh it</GroupLabel>
          <WeighForm id={d.id} />
          <RejectForm id={d.id} />
        </>
      )}
    </>,
  );
}
