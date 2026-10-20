"use client";

import { useActionState, useState } from "react";
import { rejectDrop, type StaffFormState } from "@/app/staff/actions";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { FormMessage } from "@/components/ui/Field";
import { REJECT_REASONS, type RejectReason } from "@/lib/drops";

/** Pick a reason, then reject. Hidden behind a button so it isn't tapped by accident. */
export function RejectForm({ id }: { id: string }) {
  const [state, action] = useActionState<StaffFormState, FormData>(rejectDrop, null);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<RejectReason | null>(null);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="py-2 text-[17px] text-danger">
        Reject This Drop…
      </button>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={id} />
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 px-4 text-[13px] uppercase tracking-[0.3px] text-muted">Why isn&apos;t it accepted?</legend>
        <div className="flex flex-wrap gap-2">
          {REJECT_REASONS.map((r) => (
            <label
              key={r}
              className={`cursor-pointer rounded-full px-3.5 py-2 text-[15px] has-focus-visible:outline-2 ${
                reason === r ? "bg-danger font-semibold text-card" : "bg-card text-ink"
              }`}
            >
              <input type="radio" name="reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="sr-only" />
              {r}
            </label>
          ))}
        </div>
      </fieldset>
      <FormMessage error={state?.error} />
      <SubmitButton label="Reject Drop" busyLabel="Saving…" variant="tint" disabled={reason === null} />
      <button type="button" onClick={() => setOpen(false)} className="py-1 text-[15px] text-link">
        Cancel
      </button>
    </form>
  );
}
