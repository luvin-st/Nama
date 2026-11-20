"use client";

import { useActionState, useState } from "react";
import { logBin, type LogState } from "@/app/restaurant/actions";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { Icon } from "@/components/ui/Icon";
import { GroupLabel, ListGroup, RowIcon } from "@/components/ui/Group";
import { Segmented } from "@/components/ui/Segmented";
import { MAX_LOG_KG, parseLogKg, WASTE, WASTE_TYPES, type BinLog, type WasteType } from "@/lib/kitchen";
import { RecentLogs } from "./RecentLogs";

type BranchOption = { id: number; name: string };

/** Log a bin: branch, waste type, weight, Save. */
type Props = { branches: BranchOption[]; initialBranchId: number | null; recentLogs: BinLog[] };

/** Log a bin form plus the "Latest bins" list; a saved bin is added to the top of the list straight away. */
export function LogBinForm({ branches, initialBranchId, recentLogs }: Props) {
  const [state, action] = useActionState<LogState, FormData>(logBin, null);
  const [branchId, setBranchId] = useState<number | null>(initialBranchId ?? branches[0]?.id ?? null);
  const [type, setType] = useState<WasteType | null>(null);
  const [kg, setKg] = useState("");
  const [clearedAt, setClearedAt] = useState(0);
  const [logs, setLogs] = useState(recentLogs);
  // After a successful save, empty the weight box (once per save) but keep branch and type.
  if (state?.ok && state.at !== clearedAt) {
    setClearedAt(state.at);
    setKg("");
    setLogs((prev) => [state.log, ...prev.filter((l) => l.id !== state.log.id)].slice(0, 5));
  }
  const branchName = branches.find((b) => b.id === branchId)?.name ?? "";
  const ready = branchId !== null && type !== null && parseLogKg(kg) !== null;

  return (
    <>
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="branch" value={branchId ?? ""} />
      <input type="hidden" name="branchName" value={branchName} />
      <input type="hidden" name="type" value={type ?? ""} />

      <GroupLabel>Branch</GroupLabel>
      <Segmented
        label="Branch"
        options={branches.map((b) => b.name)}
        value={branchName}
        onChange={(name) => setBranchId(branches.find((b) => b.name === name)?.id ?? null)}
      />

      <GroupLabel>Waste type</GroupLabel>
      <div role="radiogroup" aria-label="Waste type" className="grid grid-cols-3 gap-2.5">
        {WASTE_TYPES.map((t) => {
          const on = t === type;
          return (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setType(t)}
              className={`flex h-[96px] flex-col items-center justify-center gap-2 rounded-[14px] border-[1.5px] bg-card px-1 text-[14px] leading-tight text-ink ${on ? "border-primary font-semibold" : "border-transparent font-medium"}`}
            >
              <RowIcon tone={WASTE[t].tone}>
                <Icon name={WASTE[t].icon} size={17} strokeWidth={2.1} />
              </RowIcon>
              {WASTE[t].label}
            </button>
          );
        })}
      </div>

      <GroupLabel>Weight</GroupLabel>
      <ListGroup>
        <label className="flex min-h-12 items-center gap-3 px-4">
          <span className="sr-only">Weight in kilograms</span>
          <input
            name="weight"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.0"
            value={kg}
            onChange={(e) => setKg(e.target.value)}
            className="min-w-0 flex-1 bg-transparent py-3 text-[22px] font-semibold text-ink tabular-nums outline-none placeholder:text-muted"
          />
          <span className="text-[17px] text-muted">kg</span>
        </label>
      </ListGroup>
      <p className="-mt-2 px-4 text-[13px] text-muted">Up to {MAX_LOG_KG} kg per bin, for example 4.5</p>

      <SubmitButton label="Save" busyLabel="Saving…" disabled={!ready} />

      <div aria-live="polite">
        {state?.ok ? (
          <p key={state.at} className="flex items-center gap-3 rounded-[14px] bg-card px-4 py-3 text-[15px] font-medium text-ink">
            <RowIcon tone="lime">
              <Icon name="check" size={16} strokeWidth={2.8} />
            </RowIcon>
            {state.message}
          </p>
        ) : state && !state.ok ? (
          <p role="alert" className="px-4 text-[14px] text-danger">
            {state.error}
          </p>
        ) : null}
      </div>
    </form>
    <RecentLogs logs={logs} />
    </>
  );
}
