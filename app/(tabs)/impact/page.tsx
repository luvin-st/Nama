import type { Metadata } from "next";
import { BadgeGrid } from "@/components/impact/BadgeGrid";
import { BuildingRanking } from "@/components/impact/BuildingRanking";
import { BuildingStats } from "@/components/impact/BuildingStats";
import { MyImpactCard } from "@/components/impact/MyImpactCard";
import { NeighbourBoard } from "@/components/impact/NeighbourBoard";
import { Notice, ScreenHeader } from "@/components/ui/Bits";
import { getBadges } from "@/lib/badges";
import { getImpactPage } from "@/lib/data/impact";

export const metadata: Metadata = { title: "Impact · Nama'" };

export default async function ImpactPage() {
  const res = await getImpactPage();

  if (!res.ok) {
    return (
      <>
        <ScreenHeader title="Impact" />
        <div className="rounded-[14px] bg-card">
          <Notice tone="error">{res.error}</Notice>
        </div>
      </>
    );
  }

  const { me, building, buildings, neighbours } = res.data;
  return (
    <>
      <ScreenHeader title="Impact" subtitle="What you and your neighbours have composted" />
      <MyImpactCard me={me} />
      <BuildingStats building={building} />
      <BuildingRanking buildings={buildings} />
      <NeighbourBoard neighbours={neighbours} building={building?.name ?? null} />
      <BadgeGrid badges={getBadges(me)} />
      <p className="px-4 text-[12px] leading-snug text-muted">
        *CO₂ figures are estimates: about 0.7 kg CO₂e avoided per kg of food scraps composted instead of landfilled, based on
        US EPA WARM factors. Only verified drops count.
      </p>
    </>
  );
}
