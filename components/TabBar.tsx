"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./ui/Icon";

type Tab = { href: string; label: string; icon: IconName };

const LEFT: Tab[] = [
  { href: "/home", label: "Home", icon: "home" },
  { href: "/rewards", label: "Rewards", icon: "gift" },
];
const RIGHT: Tab[] = [
  { href: "/impact", label: "Impact", icon: "leaf" },
  { href: "/guide", label: "Guide", icon: "book" },
];

function TabLink({ tab, active }: { tab: Tab; active: boolean }) {
  return (
    <Link
      href={tab.href}
      aria-current={active ? "page" : undefined}
      className={`flex flex-col items-center gap-[3px] pt-0.5 text-[10px] ${active ? "font-semibold text-ink" : "font-medium text-muted"}`}
    >
      <Icon name={tab.icon} size={26} strokeWidth={1.8} filled={active} />
      {tab.label}
    </Link>
  );
}

/** Fixed bottom navigation with the scan button in the middle. */
export function TabBar() {
  const path = usePathname();
  const isActive = (href: string) => path === href || path.startsWith(`${href}/`);

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-10 border-t-[0.5px] border-sep bg-card pb-[env(safe-area-inset-bottom,0px)]"
    >
      <div className="mx-auto grid max-w-[440px] grid-cols-5 items-start px-1 pt-1.5 pb-2">
        {LEFT.map((t) => (
          <TabLink key={t.href} tab={t} active={isActive(t.href)} />
        ))}
        <Link href="/scan" aria-label="Scan a bin" className="flex justify-center">
          <span className="flex size-[50px] items-center justify-center rounded-full bg-forest text-lime">
            <Icon name="scan" size={24} strokeWidth={2.2} />
          </span>
        </Link>
        {RIGHT.map((t) => (
          <TabLink key={t.href} tab={t} active={isActive(t.href)} />
        ))}
      </div>
    </nav>
  );
}
