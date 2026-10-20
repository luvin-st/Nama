"use client";

import { useState, type FormEvent } from "react";
import { parseBinCode } from "@/lib/bins";

/** Text box for typing a bin code when the camera isn't available. */
export function ManualCode({ onCode }: { onCode: (code: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const code = parseBinCode(value);
    if (!code) {
      setError("Codes look like NAMA-B02. Check the sticker on the bin's lid.");
      return;
    }
    setError(null);
    onCode(code);
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-2">
      <label htmlFor="bin-code" className="px-1 text-[15px] text-on-hero-muted">
        Bin code
      </label>
      <div className="flex gap-2">
        <input
          id="bin-code"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. NAMA-B02"
          autoComplete="off"
          autoCapitalize="characters"
          autoFocus
          className="h-[50px] min-w-0 flex-1 rounded-xl border-[1.5px] border-scan-line bg-scan-card px-3.5 text-[17px] tracking-wider text-white uppercase placeholder:tracking-normal placeholder:text-[#8fb3a1] placeholder:normal-case"
        />
        <button type="submit" className="h-[50px] rounded-xl bg-lime px-5 text-[17px] font-semibold text-lime-ink">
          Find
        </button>
      </div>
      {error ? (
        <p role="alert" className="px-1 text-[14px] text-[#ffb4a9]">
          {error}
        </p>
      ) : null}
    </form>
  );
}
