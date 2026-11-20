"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

/** Reloads the screen's server data once each time `stamp` changes (after an action succeeds). */
export function useRefreshAfter(stamp: number | undefined) {
  const router = useRouter();
  const last = useRef(stamp);
  useEffect(() => {
    if (stamp !== undefined && stamp !== last.current) {
      last.current = stamp;
      router.refresh();
    }
  }, [stamp, router]);
}
