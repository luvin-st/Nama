"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { requestPickup, type SimpleState } from "@/app/restaurant/actions";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ListGroup, RowIcon, StaticRow } from "@/components/ui/Group";
import { relativeDay } from "@/lib/format";
import { clockTime } from "@/lib/kitchen";
import { useRefreshAfter } from "@/lib/use-refresh-after";

function RequestButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-busy={pending} className="gap-2">
      <Icon name="truck" size={22} />
      {pending ? "Sending…" : "Bins full: request pickup"}
    </Button>
  );
}

/** One button to ask for an extra pickup; shows the confirmation once requested. */
export function PickupRequest({ openRequest }: { openRequest: string | null }) {
  const [state, action] = useActionState<SimpleState, FormData>(requestPickup, null);
  useRefreshAfter(state?.done);
  const sentAt = openRequest ?? (state?.done ? new Date(state.done).toISOString() : null);

  if (sentAt) {
    return (
      <div role="status">
        <ListGroup>
          <StaticRow
            leading={
              <RowIcon tone="lime">
                <Icon name="check" size={16} strokeWidth={2.8} />
              </RowIcon>
            }
            title="Pickup requested"
            note={`Sent ${relativeDay(sentAt).toLowerCase()} at ${clockTime(sentAt)}. Our driver will come within 24 hours.`}
          />
        </ListGroup>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-2">
      <RequestButton />
      {state?.error ? (
        <p role="alert" className="text-center text-[14px] text-danger">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
