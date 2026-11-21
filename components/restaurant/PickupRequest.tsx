"use client";

import { useActionState, useCallback, useState } from "react";
import { cancelPickup, type SimpleState } from "@/app/restaurant/actions";
import { Button } from "@/components/ui/Button";
import { ListGroup, RowIcon, StaticRow } from "@/components/ui/Group";
import { Icon } from "@/components/ui/Icon";
import { Sheet } from "@/components/ui/Sheet";
import { bookingLabel, type Booking } from "@/lib/booking";
import { useRefreshAfter } from "@/lib/use-refresh-after";
import { BookPickupSheet } from "./BookPickupSheet";

/** "Bins full: request pickup" opens a sheet to choose the day and time; once booked, Change or Cancel. */
export function PickupRequest({ booking: initial, branches }: { booking: Booking | null; branches: number }) {
  const [booking, setBooking] = useState(initial);
  const [open, setOpen] = useState(false);
  const [bookedAt, setBookedAt] = useState<number>();
  const [cancelState, cancel, cancelling] = useActionState<SimpleState, FormData>(async () => {
    const res = await cancelPickup();
    if (res?.done) setBooking(null);
    return res;
  }, null);
  // So the staff route and other screens are fresh when opened next.
  useRefreshAfter(cancelState?.done);
  useRefreshAfter(bookedAt);

  const onBooked = useCallback((b: Booking) => {
    setBooking(b);
    setBookedAt(Date.now());
    setOpen(false);
  }, []);

  return (
    <>
      {booking ? (
        <div role="status" className="flex flex-col gap-2">
          <ListGroup>
            <StaticRow
              leading={
                <RowIcon tone="lime">
                  <Icon name="check" size={16} strokeWidth={2.8} />
                </RowIcon>
              }
              title="Pickup booked"
              note={`${bookingLabel(booking)} · all ${branches} branches`}
            />
          </ListGroup>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="tint" onClick={() => setOpen(true)}>
              Change
            </Button>
            <form action={cancel}>
              <Button type="submit" variant="ghost" disabled={cancelling} className="w-full">
                {cancelling ? "Cancelling…" : "Cancel booking"}
              </Button>
            </form>
          </div>
          {cancelState?.error ? (
            <p role="alert" className="text-center text-[14px] text-danger">
              {cancelState.error}
            </p>
          ) : null}
        </div>
      ) : (
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Icon name="truck" size={22} />
          Bins full: request pickup
        </Button>
      )}

      <Sheet open={open} onClose={() => setOpen(false)} title="Book a pickup">
        {open ? <BookPickupSheet current={booking} onBooked={onBooked} /> : null}
      </Sheet>
    </>
  );
}
