"use client";

import { useActionState, useState } from "react";
import { collectPickup, type CollectState } from "@/app/nama-staff/actions";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { GroupLabel, ListGroup, RowIcon, StaticRow } from "@/components/ui/Group";
import { Icon } from "@/components/ui/Icon";
import { Segmented } from "@/components/ui/Segmented";
import { formatKg } from "@/lib/format";
import { clockTime, type PickupGrade } from "@/lib/kitchen";
import { GRADE_HELP, loggedToday, MAX_COLLECT_KG, parseCollectKg, type Stop, type StopCollected } from "@/lib/nama-staff";
import { useRefreshAfter } from "@/lib/use-refresh-after";
import { CollectResult } from "./CollectResult";

const GRADES = ["A", "B", "C"] as const satisfies readonly PickupGrade[];

/** Branch, truck-scale weight, grade A/B/C (C needs a reason), Mark as collected. */
export function CollectForm({ stops, initialBranchId }: { stops: Stop[]; initialBranchId: number }) {
  const [state, action] = useActionState<CollectState, FormData>(collectPickup, null);
  const [branchId, setBranchId] = useState(initialBranchId);
  const [kg, setKg] = useState("");
  const [grade, setGrade] = useState<PickupGrade>("A");
  const [reason, setReason] = useState("");
  const [seenAt, setSeenAt] = useState(0);
  const [done, setDone] = useState<Record<number, StopCollected>>({});
  // So Route and Collected show the new pickup when opened from the tab bar.
  useRefreshAfter(state?.ok ? state.at : undefined);
  // A saved collection is shown straight away (no reload), and the form is emptied once.
  if (state?.ok && state.at !== seenAt) {
    setSeenAt(state.at);
    setDone((prev) => ({ ...prev, [state.stop.branchId]: { kg: state.stop.kg, grade: state.stop.grade, at: state.stop.at } }));
    setKg("");
    setGrade("A");
    setReason("");
  }

  const stop = stops.find((s) => s.branchId === branchId) ?? stops[0];
  if (!stop) return null;
  const collected = done[stop.branchId] ?? stop.collected;
  const ready = !collected && parseCollectKg(kg) !== null && (grade !== "C" || reason.trim().length >= 3);

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="branch" value={stop.branchId} />
      <input type="hidden" name="branchName" value={stop.name} />
      <input type="hidden" name="grade" value={grade} />

      <GroupLabel>Branch</GroupLabel>
      <Segmented
        label="Branch"
        options={stops.map((s) => s.name)}
        value={stop.name}
        onChange={(name) => setBranchId(stops.find((s) => s.name === name)?.branchId ?? stop.branchId)}
      />
      <ListGroup>
        <StaticRow
          leading={
            <RowIcon tone={collected ? "lime" : "forest"}>
              <Icon name={collected ? "check" : "pin"} size={16} strokeWidth={2.4} />
            </RowIcon>
          }
          title={stop.location}
          note={
            collected
              ? `Collected ${formatKg(collected.kg)} at ${clockTime(collected.at)}${collected.grade ? `, grade ${collected.grade}` : ""}`
              : loggedToday(stop)
          }
        />
      </ListGroup>

      {collected ? null : (
        <>
          <GroupLabel>Truck-scale weight</GroupLabel>
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
          <p className="-mt-2 px-4 text-[13px] text-muted">Up to {MAX_COLLECT_KG} kg, for example 42.5</p>

          <GroupLabel>Grade</GroupLabel>
          <Segmented label="Grade" options={GRADES} value={grade} onChange={setGrade} />
          <p className="-mt-2 px-4 text-[13px] text-muted">{GRADE_HELP[grade]}</p>

          {grade === "C" ? (
            <ListGroup>
              <label className="flex min-h-12 items-center gap-3 px-4">
                <span className="w-[92px] shrink-0 text-[17px]">Reason</span>
                <input
                  name="reason"
                  maxLength={200}
                  placeholder="What was mixed in?"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent py-3 text-[17px] text-ink outline-none placeholder:text-muted"
                />
              </label>
            </ListGroup>
          ) : null}

          <SubmitButton label="Mark as collected" busyLabel="Saving…" disabled={!ready} />
        </>
      )}

      {/* The confirmation belongs to the branch it was for; switching branch hides it. */}
      <CollectResult state={state?.ok && state.stop.branchId !== stop.branchId ? null : state} />
    </form>
  );
}
