"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { parseBinCode } from "@/lib/bins";
import { ManualCode } from "./ManualCode";
import { QrScanner } from "./QrScanner";

/** Camera scanner with a manual-entry fallback. Both lead to the confirm screen. */
export function ScanPicker() {
  const router = useRouter();
  const [manual, setManual] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const go = useCallback((code: string) => router.push(`/scan/confirm?bin=${encodeURIComponent(code)}`), [router]);

  const onScanned = useCallback(
    (text: string) => {
      const code = parseBinCode(text);
      if (code) go(code);
      else setScanError("That QR code isn't a Nama' bin. Try again or enter the code manually.");
    },
    [go],
  );

  return (
    <div className="flex flex-col gap-5">
      {manual ? <ManualCode onCode={go} /> : <QrScanner key={scanError ?? "scan"} onCode={onScanned} />}
      {scanError && !manual ? (
        <p role="alert" className="text-center text-[14px] text-[#ffb4a9]">
          {scanError}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => {
          setManual((m) => !m);
          setScanError(null);
        }}
        className="h-[52px] rounded-[14px] bg-scan-raised text-[17px] font-semibold text-lime"
      >
        {manual ? "Use the Camera Instead" : "Enter Code Manually"}
      </button>
    </div>
  );
}
