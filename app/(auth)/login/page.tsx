import type { Metadata } from "next";
import { BackBar } from "@/components/auth/BackBar";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Log In · Nama'" };

export default function LoginPage() {
  return (
    <>
      <BackBar href="/welcome" title="Log In" />
      <div className="px-1">
        <h1 className="text-balance text-[34px] font-bold leading-tight tracking-[-0.4px]">Welcome back</h1>
        <p className="mt-1 text-[15px] text-muted">Log in to see your points and drop your scraps.</p>
      </div>
      <LoginForm />
    </>
  );
}
