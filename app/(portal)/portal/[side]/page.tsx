import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackBar } from "@/components/auth/BackBar";
import { PortalLoginForm } from "@/components/portal/PortalLoginForm";
import { safeNext } from "@/lib/next-path";
import { isSide, SIDE } from "@/lib/portal";

type Props = { params: Promise<{ side: string }>; searchParams: Promise<{ next?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { side } = await params;
  return { title: isSide(side) ? `${SIDE[side].loginTitle} · Nama'` : "Nama'" };
}

/** Log in for one side of the portal (restaurant or staff). */
export default async function PortalLoginPage({ params, searchParams }: Props) {
  const [{ side }, { next }] = await Promise.all([params, searchParams]);
  if (!isSide(side)) notFound();
  const info = SIDE[side];

  return (
    <>
      <BackBar href="/" title={info.loginTitle} />
      <div className="px-1">
        <h1 className="text-balance text-[34px] font-bold leading-tight tracking-[-0.4px]">Welcome back</h1>
        <p className="mt-1 text-[15px] text-muted">{info.loginText}</p>
      </div>
      <PortalLoginForm side={side} next={safeNext(next)} />
    </>
  );
}
