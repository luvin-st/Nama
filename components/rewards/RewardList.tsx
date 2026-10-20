"use client";

import { useState } from "react";
import { Notice } from "@/components/ui/Bits";
import { ListGroup } from "@/components/ui/List";
import { Segmented } from "@/components/ui/Segmented";
import type { RewardView } from "@/lib/data/rewards";
import { CATEGORIES, type CategoryFilter } from "@/lib/rewards";
import { RedeemSheet } from "./RedeemSheet";
import { RewardRow } from "./RewardRow";

/** Category filter, reward rows, and the redeem sheet for the one you tap. */
export function RewardList({ rewards, balance }: { rewards: RewardView[]; balance: number }) {
  const [filter, setFilter] = useState<CategoryFilter>("All");
  const [chosen, setChosen] = useState<RewardView | null>(null);
  const shown = filter === "All" ? rewards : rewards.filter((r) => r.category === filter);

  return (
    <>
      <Segmented label="Reward type" options={CATEGORIES} value={filter} onChange={setFilter} />
      <ListGroup>
        {shown.length === 0 ? (
          <Notice>No {filter === "All" ? "" : `${filter.toLowerCase()} `}rewards right now. Check back soon.</Notice>
        ) : (
          shown.map((r) => <RewardRow key={r.id} reward={r} balance={balance} onRedeem={setChosen} />)
        )}
      </ListGroup>
      {chosen ? <RedeemSheet key={chosen.id} reward={chosen} balance={balance} onClose={() => setChosen(null)} /> : null}
    </>
  );
}
