import { Pill, ProgressBar } from "@/components/ui/Bits";
import type { NextReward } from "@/lib/data/home";
import { formatPoints, lowerFirst } from "@/lib/format";

type PointsCardProps = { points: number; streakWeeks: number; nextReward: NextReward };

/** Dark green card: balance, streak and progress towards the next reward. */
export function PointsCard({ points, streakWeeks, nextReward }: PointsCardProps) {
  const pct = nextReward ? (points / nextReward.cost) * 100 : 100;
  const caption = nextReward
    ? `${formatPoints(nextReward.cost - points)} points to ${lowerFirst(nextReward.title)}`
    : "You can redeem any reward";

  return (
    <section aria-label="Your points" className="rounded-[22px] bg-hero p-5 text-on-hero">
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-medium text-on-hero-muted">Points</span>
        <Pill>{streakWeeks > 0 ? `${streakWeeks}-week streak` : "New member"}</Pill>
      </div>
      <div className="mt-2 text-[54px] font-bold leading-none tracking-[-1px] tabular-nums">{formatPoints(points)}</div>
      <div className="mt-4">
        <ProgressBar value={pct} label="Progress to your next reward" />
      </div>
      <p className="mt-2 text-[13px] text-on-hero-muted">{caption}</p>
    </section>
  );
}
