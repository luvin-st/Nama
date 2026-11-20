import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { KitchenTabBar } from "@/components/restaurant/KitchenTabBar";

export const metadata: Metadata = {
  title: "NAMA for Restaurants",
  description: "Log kitchen food waste, request pickups and see what it costs, branch by branch.",
};

export const viewport: Viewport = { themeColor: "#f5f6f3", colorScheme: "light" };

/** Restaurant demo shell: one light look in both themes, phone-width column, bottom tabs. */
export default function RestaurantLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full bg-k-ground text-k-ink [color-scheme:light]">
      <main className="mx-auto flex max-w-[440px] flex-col gap-4 pt-[calc(env(safe-area-inset-top,0px)+16px)] pb-28 pl-[max(16px,env(safe-area-inset-left,0px))] pr-[max(16px,env(safe-area-inset-right,0px))]">
        {children}
      </main>
      <KitchenTabBar />
    </div>
  );
}
