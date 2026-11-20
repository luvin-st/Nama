"use client";

import { Notice } from "@/components/ui/Bits";
import { Button } from "@/components/ui/Button";

/** Shown if a restaurant screen crashes unexpectedly. */
export default function RestaurantError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col gap-3 rounded-[14px] bg-card pb-4">
      <Notice tone="error">Something went wrong loading this screen.</Notice>
      <div className="px-4">
        <Button variant="tint" onClick={reset}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
