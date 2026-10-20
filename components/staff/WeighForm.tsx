"use client";

import { useActionState, useState } from "react";
import { verifyDrop, type StaffFormState } from "@/app/staff/actions";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { TextField, FormMessage } from "@/components/ui/Field";
import { ListGroup } from "@/components/ui/List";
import { formatKg } from "@/lib/format";
import { parseKg, pointsForKg } from "@/lib/points";

/** Weight field with a live points preview, and the Verify button. */
export function WeighForm({ id }: { id: string }) {
  const [state, action] = useActionState<StaffFormState, FormData>(verifyDrop, null);
  const [weight, setWeight] = useState("");
  const kg = parseKg(weight);

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={id} />
      <ListGroup>
        <TextField
          label="Weight"
          id="weight"
          inputMode="decimal"
          autoComplete="off"
          placeholder="kg, e.g. 1.4"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
        />
      </ListGroup>
      <p aria-live="polite" className="px-4 text-[15px] text-muted tabular-nums">
        {kg !== null ? (
          <>
            {formatKg(kg)} = <span className="font-semibold text-ink">{pointsForKg(kg)} points</span>
          </>
        ) : (
          "Weigh the caddy contents and enter the weight. 20 points per kg."
        )}
      </p>
      <FormMessage error={state?.error} />
      <SubmitButton label="Verify Drop" busyLabel="Saving…" disabled={kg === null} />
    </form>
  );
}
