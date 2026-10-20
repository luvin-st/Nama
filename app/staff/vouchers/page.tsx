import type { Metadata } from "next";
import { MarkUsedForm } from "@/components/staff/MarkUsedForm";
import { StaffPage } from "@/components/staff/StaffPage";
import { VoucherLookup } from "@/components/staff/VoucherLookup";
import { Notice, Pill } from "@/components/ui/Bits";
import { ListGroup, ListRow } from "@/components/ui/List";
import { getStaffProfile, getVoucherByCode, type StaffVoucher } from "@/lib/data/staff";
import { parseVoucherCode } from "@/lib/rewards";

export const metadata: Metadata = { title: "Check Vouchers · Nama'" };

const DATE = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const value = (v: string) => <span className="text-[17px] text-muted">{v}</span>;
const box = (body: React.ReactNode) => <ListGroup>{body}</ListGroup>;

function Result({ v, myId, done }: { v: StaffVoucher; myId: string; done: boolean }) {
  return (
    <>
      {done ? (
        <p role="status" className="rounded-[14px] bg-lime px-4 py-3 text-center text-[15px] font-semibold text-lime-ink">
          Voucher marked as used
        </p>
      ) : null}
      <ListGroup>
        <ListRow title="Reward" trailing={value(v.reward.title)} />
        <ListRow title="Partner" trailing={value(v.reward.partner)} />
        <ListRow title="Resident" trailing={value(`${v.resident.name}${v.resident.flat ? ` · ${v.resident.flat}` : ""}`)} />
        <ListRow title="Redeemed" trailing={value(DATE.format(new Date(v.createdAt)))} />
        <ListRow
          title="Status"
          trailing={v.usedAt ? <Pill tone="bad">Used {DATE.format(new Date(v.usedAt))}</Pill> : <Pill>Ready to use</Pill>}
        />
      </ListGroup>
      {v.usedAt ? (
        box(<Notice>This voucher has already been used. Don&apos;t accept it again.</Notice>)
      ) : v.userId === myId ? (
        box(<Notice>This is your own voucher. Another staff member needs to check it.</Notice>)
      ) : (
        <MarkUsedForm code={v.code} />
      )}
    </>
  );
}

export default async function StaffVouchersPage({ searchParams }: { searchParams: Promise<{ code?: string; done?: string }> }) {
  const search = await searchParams;
  const me = await getStaffProfile();
  if (!me.ok) {
    return (
      <StaffPage title="Check Vouchers" backHref="/profile">
        {box(<Notice tone="error">{me.error}</Notice>)}
      </StaffPage>
    );
  }

  const code = parseVoucherCode(search.code ?? "");
  const res = code ? await getVoucherByCode(code) : null;

  return (
    <StaffPage title="Check Vouchers" backHref="/profile">
      <p className="px-1 text-[15px] text-muted">Enter the code on the resident&apos;s phone, or scan its QR code.</p>
      <VoucherLookup key={code ?? "empty"} initial={code ?? ""} />
      {search.code && !code ? box(<Notice tone="error">That isn&apos;t a Nama&apos; voucher code.</Notice>) : null}
      {res && !res.ok ? box(<Notice tone="error">{res.error}</Notice>) : null}
      {res?.ok && !res.data ? box(<Notice tone="error">We couldn&apos;t find a voucher with the code {code}.</Notice>) : null}
      {res?.ok && res.data ? <Result v={res.data} myId={me.data.id} done={search.done === "1"} /> : null}
    </StaffPage>
  );
}
