import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackBar } from "@/components/auth/BackBar";
import { PortalSignupForm } from "@/components/portal/PortalSignupForm";
import { isSide, SIDE } from "@/lib/portal";

type Props = { params: Promise<{ side: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { side } = await params;
  return { title: isSide(side) ? `${SIDE[side].signupTitle} · Nama'` : "Nama'" };
}

/** Create an account on one side of the portal. */
export default async function PortalSignupPage({ params }: Props) {
  const { side } = await params;
  if (!isSide(side)) notFound();
  const info = SIDE[side];

  return (
    <>
      <BackBar href={info.login} title="Create Account" />
      <div className="px-1">
        <h1 className="text-balance text-[34px] font-bold leading-tight tracking-[-0.4px]">{info.signupTitle}</h1>
        <p className="mt-1 text-[15px] text-muted">{info.signupText}</p>
      </div>
      <PortalSignupForm side={side} />
      {side === "restaurant" ? (
        <p className="text-center text-[13px] text-muted">For this demo, new restaurant accounts join Rania&apos;s Kitchen.</p>
      ) : null}
    </>
  );
}
