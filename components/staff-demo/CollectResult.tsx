import type { CollectState } from "@/app/nama-staff/actions";
import { RowIcon } from "@/components/ui/Group";
import { Icon } from "@/components/ui/Icon";

/** The confirmation or error under the Collect form. */
export function CollectResult({ state }: { state: CollectState }) {
  return (
    <div aria-live="polite">
      {state?.ok ? (
        <p key={state.at} className="flex items-center gap-3 rounded-[14px] bg-card px-4 py-3 text-[15px] font-medium text-ink">
          <RowIcon tone="lime">
            <Icon name="check" size={16} strokeWidth={2.8} />
          </RowIcon>
          {state.message}. The restaurant can see it now.
        </p>
      ) : state && !state.ok ? (
        <p role="alert" className="px-4 text-[14px] text-danger">
          {state.error}
        </p>
      ) : null}
    </div>
  );
}
