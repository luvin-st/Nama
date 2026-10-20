"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

type PromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };
type Mode = "hidden" | "prompt" | "ios";

const DISMISS_KEY = "nama-install-dismissed";

function isInstalled(): boolean {
  const nav = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

function isIosSafari(): boolean {
  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
  return ios && !/CriOS|FxiOS|EdgiOS/.test(ua);
}

function wasDismissed(): boolean {
  try {
    return window.localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

/** "Install Nama'" button on Android/Chrome, Add-to-Home-Screen steps on iPhone. Hidden once installed. */
export function InstallCard({ dismissible = false }: { dismissible?: boolean }) {
  const [mode, setMode] = useState<Mode>("hidden");
  const [prompt, setPrompt] = useState<PromptEvent | null>(null);

  useEffect(() => {
    if (isInstalled() || (dismissible && wasDismissed())) return;
    if (isIosSafari()) setMode("ios");
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPrompt(e as PromptEvent);
      setMode("prompt");
    };
    const onInstalled = () => setMode("hidden");
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [dismissible]);

  async function install() {
    if (!prompt) return;
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === "accepted") setMode("hidden");
    } catch {
      // The browser refused to show its prompt; leave the card as it is.
    }
    setPrompt(null);
  }

  function dismiss() {
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Private mode: it just shows again next time.
    }
    setMode("hidden");
  }

  if (mode === "hidden") return null;

  return (
    <section aria-label="Install the app" className="flex flex-col gap-3 rounded-[18px] bg-card p-4">
      <div className="flex items-start gap-3">
        <Image src="/icons/icon-192.png" alt="" width={44} height={44} className="size-11 shrink-0 rounded-[11px]" />
        <div className="min-w-0 flex-1">
          <h2 className="text-[17px] font-semibold">Add Nama&apos; to your home screen</h2>
          {mode === "ios" ? (
            <p className="mt-0.5 text-[15px] leading-snug text-muted">
              Tap <Icon name="share" size={15} strokeWidth={2.2} className="inline -translate-y-px" /> <b>Share</b> in Safari,
              then <b>Add to Home Screen</b>.
            </p>
          ) : (
            <p className="mt-0.5 text-[15px] leading-snug text-muted">Open it like an app, straight to your points.</p>
          )}
        </div>
        {dismissible ? (
          <button type="button" onClick={dismiss} aria-label="Not now" className="-m-1 p-1 text-muted">
            <Icon name="x" size={18} strokeWidth={2.4} />
          </button>
        ) : null}
      </div>
      {mode === "prompt" ? <Button onClick={install}>Install Nama&apos;</Button> : null}
    </section>
  );
}
