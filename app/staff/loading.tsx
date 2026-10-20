/** Skeleton shown while a staff screen loads. */
export default function StaffLoading() {
  const bar = "animate-pulse rounded-[14px] bg-chip motion-reduce:animate-none";
  return (
    <div aria-busy="true" aria-label="Loading" className="mx-auto flex max-w-[440px] flex-col gap-4 px-4 pt-[calc(env(safe-area-inset-top,0px)+12px)]">
      <div className={`${bar} h-11 w-full`} />
      <div className={`${bar} h-8 w-full rounded-[9px]`} />
      <div className={`${bar} h-[220px] w-full`} />
    </div>
  );
}
