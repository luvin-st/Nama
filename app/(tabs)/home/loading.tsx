/** Skeleton shown while Home's data loads. */
export default function HomeLoading() {
  const bar = "animate-pulse rounded-[14px] bg-chip motion-reduce:animate-none";
  return (
    <div aria-busy="true" aria-label="Loading your home screen" className="flex flex-col gap-4">
      <div className="flex items-end justify-between px-1 pt-2">
        <div className="flex flex-col gap-2">
          <div className={`${bar} h-4 w-40`} />
          <div className={`${bar} h-9 w-44`} />
        </div>
        <div className={`${bar} size-10 rounded-full`} />
      </div>
      <div className={`${bar} h-[188px] rounded-[22px]`} />
      <div className={`${bar} h-[78px] rounded-[18px]`} />
      <div className={`${bar} h-[150px]`} />
      <div className={`${bar} h-[120px]`} />
    </div>
  );
}
