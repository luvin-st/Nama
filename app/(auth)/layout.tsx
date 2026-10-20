import type { ReactNode } from "react";

/** Shell for welcome, sign-up and login: phone-width column, no tab bar. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto flex min-h-full max-w-[440px] flex-col gap-4 pt-[calc(env(safe-area-inset-top,0px)+20px)] pb-[calc(env(safe-area-inset-bottom,0px)+32px)] pl-[max(16px,env(safe-area-inset-left,0px))] pr-[max(16px,env(safe-area-inset-right,0px))]">
      {children}
    </main>
  );
}
