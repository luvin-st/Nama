/** Round rank number; top 3 get the lime/leaf colours. */
export function RankBadge({ rank }: { rank: number }) {
  const tone = rank === 1 ? "bg-lime text-lime-ink" : rank <= 3 ? "bg-leaf text-white" : "bg-chip text-ink";
  return (
    <span className={`flex size-[30px] shrink-0 items-center justify-center rounded-full text-[14px] font-bold tabular-nums ${tone}`}>
      {rank}
    </span>
  );
}
