import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SideGate } from "@/components/portal/SideGate";
import { StaffTabBar } from "@/components/staff-demo/StaffTabBar";

export const metadata: Metadata = {
  title: "Nama' staff",
  description: "Today's collection route, truck-scale weights and contamination grades.",
};

/** Nama staff screens (staff accounts only): same column and tab bar as the restaurant side. */
export default function NamaStaffLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-full bg-ground text-ink">
      <main className="mx-auto flex max-w-[440px] flex-col gap-4 pt-[calc(env(safe-area-inset-top,0px)+16px)] pb-28 pl-[max(16px,env(safe-area-inset-left,0px))] pr-[max(16px,env(safe-area-inset-right,0px))]">
        <SideGate side="staff">
          {children}
          <StaffTabBar />
        </SideGate>
      </main>
    </div>
  );
}
