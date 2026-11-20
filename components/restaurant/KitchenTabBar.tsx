"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";

const TABS: { href: string; label: string; icon: IconName }[] = [
  { href: "/restaurant", label: "Log a bin", icon: "bin" },
  { href: "/restaurant/pickups", label: "Pickups", icon: "truck" },
  { href: "/restaurant/report", label: "Owner report", icon: "chart" },
];

/** Bottom navigation for the restaurant screens, in the same style as the main tab bar. */
export function KitchenTabBar() {
  const path = usePathname();

  return (
    <nav
      aria-label="Restaurant"
      className="fixed inset-x-0 bottom-0 z-10 border-t-[0.5px] border-sep bg-card pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="mx-auto grid max-w-[440px] grid-cols-3 items-start px-1 pt-1.5 pb-2">
        {TABS.map((t) => {
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
