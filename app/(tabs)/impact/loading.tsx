/** Skeleton shown while Impact loads. */
export default function ImpactLoading() {
  const bar = "animate-pulse rounded-[14px] bg-chip motion-reduce:animate-none";
  return (
    <div aria-busy="true" aria-label="Loading your impact" className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 px-1 pt-2">
        <div className={`${bar} h-9 w-36`} />
        <div className={`${bar} h-4 w-64`} />
      </div>
      <div className={`${bar} h-[210px] rounded-[22px]`} />
      <div className={`${bar} h-[84px]`} />
      <div className={`${bar} h-[170px]`} />
      <div className={`${bar} h-[260px]`} />
    </div>
  );
}
