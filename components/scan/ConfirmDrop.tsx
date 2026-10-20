"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createDeposit, type DepositState } from "@/app/scan/actions";

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="h-[52px] w-full rounded-[14px] bg-lime text-[17px] font-semibold text-lime-ink disabled:opacity-60"
    >
      {pending ? "Saving your drop…" : "I've Emptied My Scraps"}
    </button>
  );
}

/** Confirms the drop and creates a pending deposit. */
export function ConfirmDrop({ code }: { code: string }) {
  const [state, action] = useActionState<DepositState, FormData>(createDeposit, null);

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="bin" value={code} />
      {state?.error ? (
        <p role="alert" className="rounded-[14px] bg-scan-card px-4 py-3 text-center text-[15px] text-[#ffb4a9]">
          {state.error}
        </p>
      ) : null}
      <ConfirmButton />
    </form>
  );
}
