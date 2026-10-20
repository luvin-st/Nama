"use client";

import { useEffect } from "react";

/** Registers the service worker (production only, so local development always shows fresh code). */
export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      // Not fatal: the app works without it, just without the offline page.
    });
  }, []);
  return null;
}
