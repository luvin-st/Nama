import type { Metadata } from "next";
import { LogoLockup } from "@/components/brand/Logo";
import { LinkButton } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";

export const metadata: Metadata = { title: "Welcome · Nama'" };

const STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: "leaf", title: "Separate", text: "Keep food scraps apart from other rubbish." },
  { icon: "scan", title: "Drop", text: "Scan your building's bin and empty your caddy." },
  { icon: "gift", title: "Earn", text: "Get points for groceries, coffee and bakery treats." },
];

export default function WelcomePage() {
  return (
    <div className="flex flex-1 flex-col gap-4 pt-10 text-center">
      <LogoLockup />
      <h1 className="mt-5 text-balance text-[34px] font-bold leading-tight tracking-[-0.4px]">
        Your scraps, grown into <span className="text-leaf">rewards</span>
      </h1>
      <p className="-mt-1 text-[17px] leading-snug text-muted">
        Turn your building&apos;s food waste into compost for local farms, and earn as you go.
      </p>
      <ul className="mt-2 flex flex-col gap-[18px] rounded-[18px] bg-card px-4 py-[18px] text-left">
        {STEPS.map((s) => (
          <li key={s.title} className="flex items-center gap-3.5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-lime text-lime-ink">
              <Icon name={s.icon} size={23} />
            </span>
            <div>
              <div className="text-[17px] font-semibold">{s.title}</div>
              <div className="text-[15px] text-muted">{s.text}</div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-col gap-1 pt-4">
        <LinkButton href="/signup">Get Started</LinkButton>
        <LinkButton href="/login" variant="ghost">
          I Already Have an Account
        </LinkButton>
      </div>
    </div>
  );
}
