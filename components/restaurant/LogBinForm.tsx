"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { logBin, type LogState } from "@/app/restaurant/actions";
import { Icon } from "@/components/ui/Icon";
import { MAX_LOG_KG, parseLogKg, WASTE, WASTE_TYPES, type WasteType } from "@/lib/kitchen";
import { KCard } from "./KitchenShell";

type BranchOption = { id: number; name: string };

function SaveButton({ ready }: { ready: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={!ready || pending}
      aria-busy={pending}
      className="h-[54px] w-full rounded-[14px] bg-k-forest text-[17px] font-semibold text-white transition-opacity disabled:opacity-40"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}

/** Log a bin: branch, waste type, weight, Save. */
export function LogBinForm({ branches, initialBranchId }: { branches: BranchOption[]; initialBranchId: number | null }) {
  const [state, action] = useActionState<LogState, FormData>(logBin, null);
  const [branchId, setBranchId] = useState<number | null>(initialBranchId ?? branches[0]?.id ?? null);
  const [type, setType] = useState<WasteType | null>(null);
  const [kg, setKg] = useState("");
  const [clearedAt, setClearedAt] = useState(0);
  // After a successful save, empty the weight box (once per save) but keep branch and type.
  if (state?.ok && state.at !== clearedAt) {
    setClearedAt(state.at);
    setKg("");
  }
  const branchName = branches.find((b) => b.id === branchId)?.name ?? "";
  const ready = branchId !== null && type !== null && parseLogKg(kg) !== null;

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="branch" value={branchId ?? ""} />
      <input type="hidden" name="branchName" value={branchName} />
      <input type="hidden" name="type" value={type ?? ""} />

      <KCard title="Branch">
        <div role="radiogroup" aria-label="Branch" className="grid grid-cols-3 gap-1 rounded-[12px] bg-k-ground p-1">
          {branches.map((b) => (
            <button
              key={b.id}
              type="button"
              role="radio"
              aria-checked={b.id === branchId}
              onClick={() => setBranchId(b.id)}
              className={`h-10 rounded-[9px] text-[15px] ${b.id === branchId ? "bg-k-forest font-semibold text-white" : "font-medium text-k-ink"}`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </KCard>

      <KCard title="Waste type">
        <div role="radiogroup" aria-label="Waste type" className="grid grid-cols-3 gap-2">
          {WASTE_TYPES.map((t) => {
            const on = t === type;
            return (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setType(t)}
                className={`flex h-[92px] flex-col items-center justify-center gap-1.5 rounded-[14px] border-2 text-[14px] font-semibold leading-tight ${on ? "border-k-green bg-k-mint text-k-forest" : "border-k-line bg-white text-k-ink"}`}
              >
                <span aria-hidden="true" className="text-[28px] leading-none">{WASTE[t].emoji}</span>
                {WASTE[t].label}
              </button>
            );
          })}
        </div>
      </KCard>

      <KCard title="Weight">
        <label className="flex items-center gap-2 rounded-[12px] border-2 border-k-line px-4 focus-within:border-k-green">
          <span className="sr-only">Weight in kilograms</span>
          <input
            name="weight"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.0"
            value={kg}
            onChange={(e) => setKg(e.target.value)}
            className="h-14 min-w-0 flex-1 bg-transparent text-[28px] font-bold text-k-ink outline-none focus-visible:outline-none placeholder:text-k-line"
          />
          <span className="text-[17px] font-semibold text-k-muted">kg</span>
        </label>
        <p className="mt-2 text-[13px] text-k-muted">Up to {MAX_LOG_KG} kg per bin, for example 4.5</p>
      </KCard>

      <SaveButton ready={ready} />

      <div aria-live="polite">
        {state?.ok ? (
          <p key={state.at} className="flex items-center gap-2 rounded-[14px] bg-k-mint px-4 py-3 text-[15px] font-semibold text-k-forest">
            <Icon name="check" size={20} strokeWidth={2.6} /> {state.message}
          </p>
        ) : state && !state.ok ? (
          <p role="alert" className="rounded-[14px] bg-k-peach px-4 py-3 text-[15px] font-medium text-k-orange">{state.error}</p>
        ) : null}
      </div>
    </form>
  );
}
