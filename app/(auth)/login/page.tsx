import type { Metadata } from "next";
import { BackBar } from "@/components/auth/BackBar";
import { LoginForm } from "@/components/auth/LoginForm";
import { safeNext, withNext } from "@/lib/next-path";

export const metadata: Metadata = { title: "Log In · Nama'" };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const next = safeNext((await searchParams).next);
  return (
    <>
      <BackBar href={withNext("/welcome", next)} title="Log In" />
      <div className="px-1">
        <h1 className="text-balance text-[34px] font-bold leading-tight tracking-[-0.4px]">Welcome back</h1>
        <p className="mt-1 text-[15px] text-muted">Log in to see your points and drop your scraps.</p>
      </div>
      <LoginForm next={next} />
    </>
  );
}
