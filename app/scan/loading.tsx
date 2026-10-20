/** Shown while a scan screen loads. */
export default function ScanLoading() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-scan text-on-hero-muted" aria-busy="true">
      <span className="flex items-center gap-2 text-[15px]">
        <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-on-hero-muted border-t-transparent motion-reduce:animate-none" />
        Loading…
      </span>
    </main>
  );
}
