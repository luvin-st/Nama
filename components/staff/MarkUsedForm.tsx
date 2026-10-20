"use client";

import { useActionState } from "react";
import { markVoucherUsed, type StaffFormState } from "@/app/staff/actions";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { FormMessage } from "@/components/ui/Field";

/** Marks the voucher as used so it can't be shown again. */
export function MarkUsedForm({ code }: { code: string }) {
  const [state, action] = useActionState<StaffFormState, FormData>(markVoucherUsed, null);
  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="code" value={code} />
      <FormMessage error={state?.error} />
      <SubmitButton label="Mark as Used" busyLabel="Saving…" />
    </form>
  );
}
