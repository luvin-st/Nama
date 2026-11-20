"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { resetDemo, type SimpleState } from "@/app/restaurant/actions";

const LINK = "text-[13px] font-medium underline underline-offset-2";

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${LINK} text-k-orange`}>
      {pending ? "Resetting…" : "Tap again to reset to the sample data"}
    </button>
  );
}

/** Small link that puts the demo back to the 15 sample logs. First tap asks, second tap resets. */
export function ResetDemo() {
  const [armed, setArmed] = useState(false);
  const [state, action] = useActionState<SimpleState, FormData>(async () => {
    const result = await resetDemo();
    if (!result?.error) setArmed(false);
    return result;
  }, null);

  return (
    <div className="flex flex-col items-center gap-1 pt-2">
      {armed ? (
        <form action={action}>
          <ConfirmButton />
        </form>
      ) : (
        <button type="button" onClick={() => setArmed(true)} className={`${LINK} text-k-muted`}>
          Reset demo data
        </button>
      )}
      {state?.error ? <p role="alert" className="text-[13px] text-k-orange">{state.error}</p> : null}
    </div>
  );
}
