import { ScreenHeader } from "./Bits";

/** Placeholder for screens that are planned but not built yet. Shows no fake data. */
export function ComingSoon({ title, feature }: { title: string; feature: string }) {
  return (
    <>
      <ScreenHeader title={title} />
      <div className="rounded-[14px] bg-card px-4 py-6 text-center text-[15px] text-muted">
        This screen is built in {feature}.
      </div>
    </>
  );
}
