"use client";

import { useActionState, useEffect, useState } from "react";
import { bookPickup, type BookState } from "@/app/restaurant/actions";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { GroupLabel, ListGroup } from "@/components/ui/Group";
import { Icon } from "@/components/ui/Icon";
import { bookingDays, SLOT, slotOpen, SLOTS, type Booking, type Slot } from "@/lib/booking";

type Props = { current: Booking | null; onBooked: (b: Booking) => void };

/** Inside the "Book a pickup" sheet: day chips, time slots, Book pickup. */
export function BookPickupSheet({ current, onBooked }: Props) {
  const [state, action] = useActionState<BookState, FormData>(bookPickup, null);
  const [days] = useState(() => bookingDays().filter((d) => SLOTS.some((s) => slotOpen(d.day, s))));
  const firstOpen = (day: string) => SLOTS.find((s) => slotOpen(day, s)) ?? "morning";
  const [day, setDay] = useState(() => (current && days.some((d) => d.day === current.day) ? current.day : (days[0]?.day ?? "")));
  const [slot, setSlot] = useState<Slot>(() => (current && slotOpen(day, current.slot) ? current.slot : firstOpen(day)));

  useEffect(() => {
    if (state?.ok) onBooked(state.booking);
  }, [state, onBooked]);

  const pickDay = (d: string) => {
    setDay(d);
    if (!slotOpen(d, slot)) setSlot(firstOpen(d));
  };

  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="day" value={day} />
      <input type="hidden" name="slot" value={slot} />

      <GroupLabel>Day</GroupLabel>
      <div role="group" aria-label="Day" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {days.map((d) => {
          const on = d.day === day;
          return (
            <button
              key={d.day}
              type="button"
              aria-pressed={on}
              onClick={() => pickDay(d.day)}
              className={`flex min-w-[76px] shrink-0 flex-col items-center rounded-[12px] px-3 py-2 ${on ? "bg-primary text-on-primary" : "bg-card text-ink"}`}
            >
              <span className="text-[15px] font-semibold">{d.top}</span>
              <span className={`text-[13px] ${on ? "" : "text-muted"}`}>{d.bottom}</span>
            </button>
          );
        })}
      </div>

      <GroupLabel>Time</GroupLabel>
      <ListGroup>
        {SLOTS.map((s) => {
          const open = slotOpen(day, s);
          const on = s === slot;
          return (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={on}
              disabled={!open}
              onClick={() => setSlot(s)}
              className="flex min-h-[44px] w-full items-center gap-3 px-4 py-[11px] text-left text-[17px] text-ink disabled:text-muted"
            >
              <span className="flex-1">
                {SLOT[s].label}
                {!open ? <span className="ml-2 text-[13px]">Already started</span> : null}
              </span>
              {on ? <Icon name="check" size={20} strokeWidth={2.6} className="text-link" /> : null}
            </button>
          );
        })}
      </ListGroup>
      <p className="-mt-2 px-4 text-[13px] text-muted">One truck collects all branches in this window.</p>

      {state && !state.ok ? (
        <p role="alert" className="px-4 text-[14px] text-danger">
          {state.error}
        </p>
      ) : null}
      <SubmitButton label={current ? "Change booking" : "Book pickup"} busyLabel="Booking…" disabled={!day} />
    </form>
  );
}
