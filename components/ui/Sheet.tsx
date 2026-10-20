"use client";

import { useEffect, useRef, type ReactNode } from "react";

type SheetProps = { open: boolean; onClose: () => void; title: string; children: ReactNode };

/** Bottom sheet dialog. Closes on Escape or a tap outside the panel. */
export function Sheet({ open, onClose, title, children }: SheetProps) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    panel.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/45" onClick={onClose}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90%] w-full max-w-[440px] flex-col gap-4 overflow-y-auto rounded-t-[18px] bg-ground px-4 pt-2.5 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] outline-none"
      >
        <span aria-hidden="true" className="mx-auto mb-1 h-[5px] w-9 rounded-full bg-sep" />
        <h2 className="text-balance text-center text-[22px] font-bold">{title}</h2>
        {children}
      </div>
    </div>
  );
}
