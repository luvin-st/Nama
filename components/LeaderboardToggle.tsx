"use client";

import { useActionState, useOptimistic, startTransition } from "react";
import { setLeaderboardVisibility, type ToggleState } from "@/app/(tabs)/profile/actions";

/** iOS-style switch: show me on the neighbours leaderboard. Saves straight away. */
export function LeaderboardToggle({ initial }: { initial: boolean }) {
  const [state, action, pending] = useActionState<ToggleState, FormData>(setLeaderboardVisibility, { value: initial });
  const [on, setOn] = useOptimistic(state.value);

  function toggle() {
    const next = !on;
    const fd = new FormData();
    if (next) fd.set("show", "on");
    startTransition(() => {
      setOn(next);
      action(fd);
    });
  }

  return (
    <div className="px-4 py-[11px]">
      <div className="flex min-h-[22px] items-center gap-3">
        <span id="lb-label" className="flex-1 text-[17px]">
          Show me on the neighbours leaderboard
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-labelledby="lb-label"
          aria-busy={pending}
          onClick={toggle}
          className={`relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors motion-reduce:transition-none ${on ? "bg-leaf" : "bg-track"}`}
        >
          <span
            className={`absolute top-[2px] left-[2px] size-[27px] rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.2)] transition-transform motion-reduce:transition-none ${
              on ? "translate-x-[20px]" : ""
            }`}
          />
        </button>
      </div>
      <p className="mt-1 text-[13px] text-muted">
        {on ? "Neighbours see you as your first name and last initial." : "Hidden from neighbours. You can still see your own rank."}
      </p>
      {state.error ? (
        <p role="alert" className="mt-1 text-[13px] text-danger">
          {state.error}
        </p>
      ) : null}
    </div>
  );
}
