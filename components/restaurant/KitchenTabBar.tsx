import { BottomTabs, type Tab } from "@/components/ui/BottomTabs";

const TABS: readonly Tab[] = [
  { href: "/restaurant", label: "Log a bin", icon: "bin" },
  { href: "/restaurant/pickups", label: "Pickups", icon: "truck" },
  { href: "/restaurant/report", label: "Owner report", icon: "chart" },
];

/** Bottom navigation for the restaurant screens. */
export function KitchenTabBar() {
  return <BottomTabs tabs={TABS} label="Restaurant" />;
}
