"use client";

import { Notice, ScreenHeader } from "@/components/ui/Bits";
import { Button } from "@/components/ui/Button";

/** Shown if Rewards crashes unexpectedly. No points are spent when this happens. */
export default function RewardsError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <>
      <ScreenHeader title="Rewards" />
      <div className="flex flex-col gap-3 rounded-[14px] bg-card pb-4">
        <Notice tone="error">Something went wrong loading rewards. Your points are safe.</Notice>
        <div className="px-4">
          <Button variant="tint" onClick={reset}>
            Try Again
          </Button>
        </div>
      </div>
    </>
  );
}
