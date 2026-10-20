import { Icon } from "@/components/ui/Icon";
import { RowIcon } from "@/components/ui/List";
import type { RewardView } from "@/lib/data/rewards";
import { formatPoints } from "@/lib/format";
import { pointsNeeded } from "@/lib/rewards";

const TONE = { Grocery: "leaf", Bakery: "lime", "Cafés": "forest" } as const;

type Props = { reward: RewardView; balance: number; onRedeem: (r: RewardView) => void };

/** One reward: Redeem button if you can afford it, otherwise how far you are. */
export function RewardRow({ reward, balance, onRedeem }: Props) {
  const need = pointsNeeded(balance, reward.cost);
  const pct = Math.min(100, Math.round((balance / reward.cost) * 100));

  return (
    <div className="flex min-h-[64px] items-center gap-3 px-4 py-3">
      <RowIcon tone={TONE[reward.category]}>
        <Icon name="gift" size={17} strokeWidth={2.2} />
      </RowIcon>
      <div className="min-w-0 flex-1">
        <div className="text-[17px]">{reward.title}</div>
        <div className="mt-px text-[13px] text-muted">
          {reward.partner} · <span className="tabular-nums">{formatPoints(reward.cost)} pts</span>
        </div>
        {need > 0 ? (
          <div className="mt-2 flex items-center gap-2">
            <div
              role="progressbar"
              aria-label={`Progress to ${reward.title}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              className="h-1.5 flex-1 overflow-hidden rounded bg-track"
            >
              <div className="h-full rounded bg-leaf" style={{ width: `${pct}%` }} />
            </div>
            <span className="shrink-0 text-[13px] text-muted tabular-nums">{formatPoints(need)} more</span>
          </div>
        ) : null}
      </div>
      {need > 0 ? (
        <Icon name="lock" size={18} strokeWidth={2.2} className="shrink-0 text-muted" />
      ) : (
        <button
          type="button"
          onClick={() => onRedeem(reward)}
          className="shrink-0 rounded-full bg-primary px-4 py-1.5 text-[15px] font-semibold text-on-primary"
        >
          Redeem
        </button>
      )}
    </div>
  );
}
