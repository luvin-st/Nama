import type { Metadata } from "next";
import type { ReactNode } from "react";
import { KitchenTabBar } from "@/components/restaurant/KitchenTabBar";

export const metadata: Metadata = {
  title: "Nama' for restaurants",
  description: "Log kitchen food waste, schedule pickups and see what it costs, branch by branch.",
};

/** Restaurant screens: phone-width column and bottom tab bar, in the main app's look. */
export default function RestaurantLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full bg-ground text-ink">
      <main className="mx-auto flex max-w-[440px] flex-col gap-4 pt-[calc(env(safe-area-inset-top,0px)+16px)] pb-28 pl-[max(16px,env(safe-area-inset-left,0px))] pr-[max(16px,env(safe-area-inset-right,0px))]">
        {children}
      </main>
      <KitchenTabBar />
    </div>
  );
}
