"use client";

import { Notice, ScreenHeader } from "@/components/ui/Bits";
import { Button } from "@/components/ui/Button";

/** Shown if Home crashes unexpectedly. */
export default function HomeError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <>
      <ScreenHeader title="Home" />
      <div className="flex flex-col gap-3 rounded-[14px] bg-card pb-4">
        <Notice tone="error">Something went wrong loading your home screen.</Notice>
        <div className="px-4">
          <Button variant="tint" onClick={reset}>
            Try Again
          </Button>
        </div>
      </div>
    </>
  );
}
