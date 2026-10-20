import { Notice, Pill } from "@/components/ui/Bits";
import { GroupLabel, ListGroup, ListRow } from "@/components/ui/List";
import type { VoucherView } from "@/lib/data/rewards";
import { relativeDay } from "@/lib/format";

/** Your vouchers, newest first. */
export function VoucherList({ vouchers }: { vouchers: VoucherView[] }) {
  return (
    <>
      <GroupLabel>My vouchers</GroupLabel>
      <ListGroup>
        {vouchers.length === 0 ? (
          <Notice>Vouchers you redeem will appear here.</Notice>
        ) : (
          vouchers.map((v) => (
            <ListRow
              key={v.id}
              href={`/rewards/vouchers/${v.id}`}
              title={v.reward.title}
              note={`${v.code} · ${relativeDay(v.createdAt)}`}
              trailing={v.usedAt ? <Pill tone="wait">Used</Pill> : <Pill>Ready to use</Pill>}
            />
          ))
        )}
      </ListGroup>
    </>
  );
}
