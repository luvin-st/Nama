/** Skeleton shown while Rewards loads. */
export default function RewardsLoading() {
  const bar = "animate-pulse rounded-[14px] bg-chip motion-reduce:animate-none";
  return (
    <div aria-busy="true" aria-label="Loading rewards" className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 px-1 pt-2">
        <div className={`${bar} h-9 w-40`} />
        <div className={`${bar} h-4 w-64`} />
      </div>
      <div className={`${bar} h-[92px] rounded-[22px]`} />
      <div className={`${bar} h-8 rounded-[9px]`} />
      <div className={`${bar} h-[320px]`} />
    </div>
  );
}
