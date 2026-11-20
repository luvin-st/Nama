"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";

export type Tab = { href: string; label: string; icon: IconName };

/** Bottom navigation in the main tab bar's style (line icons, filled when active). */
export function BottomTabs({ tabs, label }: { tabs: readonly Tab[]; label: string }) {
  const path = usePathname();

  return (
    <nav aria-label={label} className="fixed inset-x-0 bottom-0 z-10 border-t-[0.5px] border-sep bg-card pb-[env(safe-area-inset-bottom,0px)]">
      <div className="mx-auto grid max-w-[440px] auto-cols-fr grid-flow-col items-start px-1 pt-1.5 pb-2">
        {tabs.map((t) => {
          const active = path === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-[3px] pt-0.5 text-[10px] ${active ? "font-semibold text-ink" : "font-medium text-muted"}`}
            >
              <Icon name={t.icon} size={26} strokeWidth={1.8} filled={active} />
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
