import { BottomTabs, type Tab } from "@/components/ui/BottomTabs";

const TABS: readonly Tab[] = [
  { href: "/nama-staff", label: "Route", icon: "pin" },
  { href: "/nama-staff/collect", label: "Collect", icon: "scale" },
  { href: "/nama-staff/collected", label: "Collected", icon: "calendar" },
];

/** Bottom navigation for the Nama staff screens. */
export function StaffTabBar() {
  return <BottomTabs tabs={TABS} label="Nama staff" />;
}
