import type { Metadata } from "next";
import { BackBar } from "@/components/auth/BackBar";
import { SignupForm } from "@/components/auth/SignupForm";
import { Notice } from "@/components/ui/Bits";
import { LinkButton } from "@/components/ui/Button";
import { getBuildings } from "@/lib/data/buildings";
import { safeNext, withNext } from "@/lib/next-path";

export const metadata: Metadata = { title: "Create Account · Nama'" };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function SignupPage({ searchParams }: Props) {
  const next = safeNext((await searchParams).next);
  const buildings = await getBuildings();

  return (
    <>
      <BackBar href={withNext("/welcome", next)} title="Create Account" />
      <div className="px-1">
        <h1 className="text-balance text-[34px] font-bold leading-tight tracking-[-0.4px]">Join your building</h1>
        <p className="mt-1 text-[15px] text-muted">We use this to match you to the right bin and pickup day.</p>
      </div>
      {buildings.ok ? (
        <SignupForm buildings={buildings.data} next={next} />
      ) : (
        <div className="flex flex-col gap-3 rounded-[14px] bg-card pb-4">
          <Notice tone="error">{buildings.error}</Notice>
          <div className="px-4">
            <LinkButton href="/signup" variant="tint">
              Try Again
            </LinkButton>
          </div>
        </div>
      )}
      <p className="text-center text-[13px] text-muted">New members get 50 welcome points.</p>
    </>
  );
}
