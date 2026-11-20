/** Skeleton shown while a restaurant screen loads. */
export default function RestaurantLoading() {
  const bar = "animate-pulse rounded-[18px] bg-k-line motion-reduce:animate-none";
  return (
    <div aria-busy="true" aria-label="Loading" className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <div className={`${bar} h-7 w-28`} />
        <div className={`${bar} h-7 w-32 rounded-full`} />
      </div>
      <div className={`${bar} h-8 w-44`} />
      <div className={`${bar} h-[150px]`} />
      <div className={`${bar} h-[140px]`} />
      <div className={`${bar} h-[120px]`} />
    </div>
  );
}
