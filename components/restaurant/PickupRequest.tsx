"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { requestPickup, type SimpleState } from "@/app/restaurant/actions";
import { Icon } from "@/components/ui/Icon";
import { relativeDay } from "@/lib/format";
import { clockTime } from "@/lib/kitchen";

function RequestButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="flex h-[58px] w-full items-center justify-center gap-2 rounded-[14px] bg-k-orange text-[17px] font-semibold text-white disabled:opacity-60"
    >
      <Icon name="truck" size={22} />
      {pending ? "Sending…" : "Bins full: request pickup"}
    </button>
  );
}

/** One button to ask for an extra pickup; shows the confirmation once requested. */
export function PickupRequest({ openRequest }: { openRequest: string | null }) {
  const [state, action] = useActionState<SimpleState, FormData>(requestPickup, null);

  if (openRequest) {
    return (
      <div role="status" className="flex items-start gap-3 rounded-[14px] bg-k-mint px-4 py-3.5 text-k-forest">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-k-green text-white">
          <Icon name="check" size={18} strokeWidth={2.8} />
        </span>
        <div>
          <p className="text-[16px] font-semibold">Pickup requested</p>
          <p className="text-[14px]">
            Sent {relativeDay(openRequest).toLowerCase()} at {clockTime(openRequest)}. Our driver will come within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-2">
      <RequestButton />
      {state?.error ? (
        <p role="alert" className="text-center text-[14px] text-k-orange">{state.error}</p>
      ) : null}
    </form>
  );
}
