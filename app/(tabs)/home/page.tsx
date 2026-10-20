import { ProfileButton } from "@/components/ProfileButton";
import { Notice, ScreenHeader } from "@/components/ui/Bits";
import { getProfile, initials } from "@/lib/data/profile";

export default async function HomePage() {
  const profile = await getProfile();

  if (!profile.ok) {
    return (
      <>
        <ScreenHeader title="Home" />
        <div className="rounded-[14px] bg-card">
          <Notice tone="error">{profile.error}</Notice>
        </div>
      </>
    );
  }

  const { name, building } = profile.data;
  const first = name.split(/\s+/)[0] ?? name;

  return (
    <>
      <ScreenHeader
        title={`Hi, ${first}`}
        subtitle={building?.name ?? "No building set"}
        trailing={<ProfileButton initials={initials(name)} />}
      />
      <div className="rounded-[14px] bg-card px-4 py-6 text-center text-[15px] text-muted">
        Your points and recent drops arrive in Feature 3.
      </div>
    </>
  );
}
