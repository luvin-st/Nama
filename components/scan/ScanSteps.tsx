import { Icon } from "@/components/ui/Icon";

const STEPS = ["Scan the code on the bin", "Empty your food scraps inside", "We weigh and check it, then add points"];

/** Numbered steps; steps before `active` show a tick. */
export function ScanSteps({ active }: { active: 0 | 1 | 2 | 3 }) {
  return (
    <ol className="divide-y-[0.5px] divide-scan-line rounded-[14px] bg-scan-card">
      {STEPS.map((step, i) => {
        const done = i < active;
        const current = i === active;
        return (
          <li key={step} className="flex items-center gap-3.5 px-4 py-3">
            <span
              className={`flex size-[26px] shrink-0 items-center justify-center rounded-full text-[14px] font-bold ${
                done || current ? "bg-lime text-lime-ink" : "bg-scan-line text-white"
              }`}
            >
              {done ? <Icon name="check" size={13} strokeWidth={3.4} /> : i + 1}
            </span>
            <span className="text-[16px]">{step}</span>
          </li>
        );
      })}
    </ol>
  );
}
