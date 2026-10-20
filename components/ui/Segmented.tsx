"use client";

type SegmentedProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  label: string;
};

/** iOS-style segmented control. */
export function Segmented<T extends string>({ options, value, onChange, label }: SegmentedProps<T>) {
  return (
    <div role="group" aria-label={label} className="grid auto-cols-fr grid-flow-col gap-0.5 rounded-[9px] bg-track p-0.5">
      {options.map((opt) => {
        const on = opt === value;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(opt)}
            className={`h-8 rounded-[7px] text-[13px] ${on ? "bg-card font-semibold shadow-[0_1px_3px_rgba(16,36,27,0.15)]" : "font-medium"}`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
