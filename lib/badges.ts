import type { IconName } from "@/components/ui/Icon";

export type BadgeStats = { verifiedDrops: number; totalKg: number; streakWeeks: number; rewardsRedeemed: number };

export type Badge = {
  id: string;
  title: string;
  icon: IconName;
  earned: boolean;
  /** 0–100 */
  progress: number;
  /** "3 of 5 drops", or what it was for once earned. */
  caption: string;
};

type Rule = { id: string; title: string; icon: IconName; value: (s: BadgeStats) => number; goal: number; unit: string; done: string };

const RULES: Rule[] = [
  { id: "first-drop", title: "First Drop", icon: "sprout", value: (s) => s.verifiedDrops, goal: 1, unit: "drop", done: "Your first verified drop" },
  { id: "regular", title: "Regular", icon: "check", value: (s) => s.verifiedDrops, goal: 5, unit: "drops", done: "5 verified drops" },
  { id: "10kg", title: "10 kg Club", icon: "leaf", value: (s) => s.totalKg, goal: 10, unit: "kg", done: "10 kg composted" },
  { id: "25kg", title: "Compost Hero", icon: "bin", value: (s) => s.totalKg, goal: 25, unit: "kg", done: "25 kg composted" },
  { id: "streak", title: "On a Roll", icon: "flame", value: (s) => s.streakWeeks, goal: 4, unit: "weeks", done: "4-week streak" },
  { id: "reward", title: "First Reward", icon: "gift", value: (s) => s.rewardsRedeemed, goal: 1, unit: "reward", done: "Redeemed a reward" },
];

function amount(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

/** Turns your numbers into the six badges, earned ones first keeping their order. */
export function getBadges(stats: BadgeStats): Badge[] {
  const badges = RULES.map((r): Badge => {
    const v = Math.max(0, r.value(stats));
    const earned = v >= r.goal;
    return {
      id: r.id,
      title: r.title,
      icon: r.icon,
      earned,
      progress: Math.min(100, Math.round((v / r.goal) * 100)),
      caption: earned ? r.done : `${amount(Math.floor(v * 10) / 10)} of ${r.goal} ${r.unit}`,
    };
  });
  return [...badges.filter((b) => b.earned), ...badges.filter((b) => !b.earned)];
}
