import type { ReactNode } from "react";
import { TabBar } from "@/components/TabBar";

/** Shared shell for the four tab screens: phone-width column plus bottom tab bar. */
export default function TabsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="mx-auto flex max-w-[440px] flex-col gap-4 pt-[calc(env(safe-area-inset-top,0px)+20px)] pb-32 pl-[max(16px,env(safe-area-inset-left,0px))] pr-[max(16px,env(safe-area-inset-right,0px))]">
        {children}
      </main>
      <TabBar />
    </>
  );
}
