import type { Metadata } from "next";
import { SortCard } from "@/components/guide/SortCard";
import { ScreenHeader } from "@/components/ui/Bits";
import { Icon } from "@/components/ui/Icon";
import { ListGroup, ListRow, RowIcon } from "@/components/ui/List";
import { ACCEPTED_ITEMS, REJECTED_ITEMS } from "@/lib/guide";

export const metadata: Metadata = { title: "Sorting Guide · Nama'" };

export default function GuidePage() {
  return (
    <>
      <ScreenHeader title="Sorting Guide" subtitle="Only food scraps go in the Nama' bin." />
      <SortCard kind="yes" title="Yes — put these in" subtitle="These earn you points" items={ACCEPTED_ITEMS} />
      <SortCard kind="no" title="No — keep these out" subtitle="These spoil the compost" items={REJECTED_ITEMS} />
      <ListGroup>
        <ListRow
          leading={
            <RowIcon tone="forest">
              <Icon name="bulb" size={17} strokeWidth={2.2} />
            </RowIcon>
          }
          title={<span className="text-[15px] font-semibold">Not sure?</span>}
          note={<span className="text-[15px]">If it didn&apos;t grow, don&apos;t throw. Leave it out.</span>}
        />
      </ListGroup>
    </>
  );
}
