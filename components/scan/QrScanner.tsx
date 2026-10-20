"use client";

import { useEffect, useRef, useState } from "react";
import type { IScannerControls } from "@zxing/browser";

type Status = "starting" | "scanning" | "denied" | "no-camera" | "insecure" | "error";

const MESSAGES: Record<Exclude<Status, "starting" | "scanning">, string> = {
  denied: "Camera access is turned off. Allow the camera in your browser settings, or enter the code manually.",
  "no-camera": "We couldn't find a camera on this device. Enter the bin code manually instead.",
  insecure: "Your browser only allows the camera on a secure (https) link. Enter the bin code manually for now.",
  error: "The camera couldn't start. Enter the bin code manually instead.",
};

/** Live camera viewfinder that calls `onCode` with the text of the first QR code it reads. */
export function QrScanner({ onCode }: { onCode: (text: string) => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const handler = useRef(onCode);
  const [status, setStatus] = useState<Status>("starting");

  useEffect(() => {
    handler.current = onCode;
  }, [onCode]);

  useEffect(() => {
    let controls: IScannerControls | null = null;
    let cancelled = false;

    async function start() {
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        setStatus("insecure");
        return;
      }
      try {
        const { BrowserQRCodeReader } = await import("@zxing/browser");
        const reader = new BrowserQRCodeReader();
        if (!video.current || cancelled) return;
        controls = await reader.decodeFromConstraints(
          { video: { facingMode: "environment" } },
          video.current,
          (result, _err, ctrl) => {
            if (result) {
              ctrl.stop();
              handler.current(result.getText());
            }
          },
        );
        if (cancelled) controls.stop();
        else setStatus("scanning");
      } catch (e) {
        const name = e instanceof Error ? e.name : "";
        if (name === "NotAllowedError" || name === "SecurityError") setStatus("denied");
        else if (name === "NotFoundError" || name === "OverconstrainedError") setStatus("no-camera");
        else setStatus("error");
      }
    }

    void start();
    return () => {
      cancelled = true;
      controls?.stop();
    };
  }, []);

  const blocked = status !== "starting" && status !== "scanning";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative aspect-square w-[260px] max-w-full overflow-hidden rounded-[28px] bg-scan-card">
        <video ref={video} muted playsInline aria-label="Camera view" className={`size-full object-cover ${blocked ? "hidden" : ""}`} />
        <span aria-hidden="true" className="absolute top-0 left-0 size-[52px] rounded-tl-[28px] border-t-4 border-l-4 border-lime" />
        <span aria-hidden="true" className="absolute top-0 right-0 size-[52px] rounded-tr-[28px] border-t-4 border-r-4 border-lime" />
        <span aria-hidden="true" className="absolute bottom-0 left-0 size-[52px] rounded-bl-[28px] border-b-4 border-l-4 border-lime" />
        <span aria-hidden="true" className="absolute right-0 bottom-0 size-[52px] rounded-br-[28px] border-r-4 border-b-4 border-lime" />
        {status === "starting" ? (
          <p className="absolute inset-0 flex items-center justify-center text-[15px] text-on-hero-muted">Starting camera…</p>
        ) : null}
        {blocked ? (
          <p role="alert" className="absolute inset-0 flex items-center justify-center px-8 text-center text-[15px] leading-snug text-on-hero-muted">
            {MESSAGES[status]}
          </p>
        ) : null}
      </div>
    </div>
  );
}
