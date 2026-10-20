import type { Metadata } from "next";
import { DropButton } from "@/components/home/DropButton";
import { OverviewList } from "@/components/home/OverviewList";
import { PointsCard } from "@/components/home/PointsCard";
import { RecentDrops } from "@/components/home/RecentDrops";
import { ProfileButton } from "@/components/ProfileButton";
import { Notice, ScreenHeader } from "@/components/ui/Bits";
import { LinkButton } from "@/components/ui/Button";
import { getHomeData } from "@/lib/data/home";
import { getProfile, initials } from "@/lib/data/profile";

export const metadata: Metadata = { title: "Home · Nama'" };

function greeting(): string {
  const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", hour: "numeric", hourCycle: "h23" }).format(new Date()));
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
}

export default async function HomePage() {
  const [profile, home] = await Promise.all([getProfile(), getHomeData()]);

  if (!profile.ok || !home.ok) {
    const message = !profile.ok ? profile.error : !home.ok ? home.error : "";
    return (
      <>
        <ScreenHeader title="Home" />
        <div className="flex flex-col gap-3 rounded-[14px] bg-card pb-4">
          <Notice tone="error">{message}</Notice>
          <div className="px-4">
            <LinkButton href="/home" variant="tint">
              Try Again
            </LinkButton>
          </div>
        </div>
      </>
    );
  }

  const { name, building } = profile.data;
  const { summary, nextReward, drops } = home.data;
  const first = name.split(/\s+/)[0] ?? name;

  return (
    <>
      <ScreenHeader
        title={`Hi, ${first}`}
        subtitle={`${building?.name ?? "Nama'"} · ${greeting()}`}
        trailing={<ProfileButton initials={initials(name)} />}
      />
      <PointsCard points={summary.points} streakWeeks={summary.streakWeeks} nextReward={nextReward} />
      <DropButton pendingCount={summary.pendingCount} />
      <OverviewList building={building} monthKg={summary.monthKg} />
      <RecentDrops drops={drops} />
    </>
  );
}
