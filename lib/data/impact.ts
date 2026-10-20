import { createClient } from "@/lib/supabase/server";
import { fail, NETWORK_ERROR, ok, type Result } from "@/lib/result";

export type MyImpact = { totalKg: number; verifiedDrops: number; rewardsRedeemed: number; streakWeeks: number };
export type BuildingImpact = { name: string; monthKg: number; totalKg: number; residents: number; activeThisMonth: number };
export type BuildingRank = { name: string; residents: number; monthKg: number; kgPerResident: number; isMine: boolean };
export type Neighbour = { rank: number; name: string; monthKg: number; isMe: boolean; hidden: boolean };

export type ImpactPage = {
  me: MyImpact;
  building: BuildingImpact | null;
  buildings: BuildingRank[];
  neighbours: Neighbour[];
};

/** Everything the Impact tab needs, loaded in parallel. Shared numbers are totals only. */
export async function getImpactPage(): Promise<Result<ImpactPage>> {
  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return fail("You're signed out. Log in again to continue.");

    const [mine, summary, building, ranking, board] = await Promise.all([
      supabase.rpc("get_my_impact"),
      supabase.rpc("get_my_summary"),
      supabase.rpc("get_building_impact"),
      supabase.rpc("get_building_ranking"),
      supabase.rpc("get_neighbour_leaderboard"),
    ]);

    if (mine.error || summary.error) return fail("We couldn't load your impact. Please try again.");
    if (building.error || ranking.error || board.error) return fail("We couldn't load your building's numbers. Please try again.");

    const m = mine.data[0];
    const b = building.data[0];
    return ok({
      me: {
        totalKg: Number(m?.total_kg ?? 0),
        verifiedDrops: m?.verified_drops ?? 0,
        rewardsRedeemed: m?.rewards_redeemed ?? 0,
        streakWeeks: summary.data[0]?.streak_weeks ?? 0,
      },
      building: b
        ? {
            name: b.building_name,
            monthKg: Number(b.month_kg),
            totalKg: Number(b.total_kg),
            residents: b.residents,
            activeThisMonth: b.active_this_month,
          }
        : null,
      buildings: ranking.data.map((r) => ({
        name: r.building_name,
        residents: r.residents,
        monthKg: Number(r.month_kg),
        kgPerResident: Number(r.kg_per_resident),
        isMine: r.is_mine,
      })),
      neighbours: board.data.map((n) => ({
        rank: n.rank,
        name: n.display_name,
        monthKg: Number(n.month_kg),
        isMe: n.is_me,
        hidden: n.hidden,
      })),
    });
  } catch {
    return fail(NETWORK_ERROR);
  }
}
