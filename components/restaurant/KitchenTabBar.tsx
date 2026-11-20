"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";

const TABS: { href: string; label: string; icon: IconName }[] = [
  { href: "/restaurant", label: "Log a bin", icon: "bin" },
  { href: "/restaurant/pickups", label: "Pickups", icon: "truck" },
  { href: "/restaurant/report", label: "Owner report", icon: "chart" },
];

/** Bottom navigation for the three restaurant screens. */
export function KitchenTabBar() {
  const path = usePathname();

  return (
    <nav aria-label="Restaurant" className="fixed inset-x-0 bottom-0 z-10 border-t border-k-line bg-white pb-[env(safe-area-inset-bottom,0px)]">
      <div className="mx-auto grid max-w-[440px] grid-cols-3 px-2 pt-2 pb-2">
        {TABS.map((t) => {
          const active = path === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-col items-center gap-1 text-[11px] ${active ? "font-semibold text-k-forest" : "font-medium text-k-muted"}`}
            >
              <span className={`flex h-8 w-14 items-center justify-center rounded-full ${active ? "bg-k-mint" : ""}`}>
                <Icon name={t.icon} size={22} strokeWidth={active ? 2.2 : 1.8} />
              </span>
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
