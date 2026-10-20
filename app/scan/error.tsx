"use client";

import { ScanHeading, ScanShell } from "@/components/scan/ScanShell";

/** Shown if a scan screen crashes unexpectedly. */
export default function ScanError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ScanShell title="Scan Bin">
      <ScanHeading title="Something went wrong" text="Your drop wasn't saved. Please try again." />
      <button type="button" onClick={reset} className="h-[52px] rounded-[14px] bg-lime text-[17px] font-semibold text-lime-ink">
        Try Again
      </button>
    </ScanShell>
  );
}
