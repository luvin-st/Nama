import Link from "next/link";

/** Round initials button in a screen header that opens the profile. */
export function ProfileButton({ initials }: { initials: string }) {
  return (
    <Link
      href="/profile"
      aria-label="Your profile"
      className="mb-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-card text-[15px] font-semibold text-ink"
    >
      {initials}
    </Link>
  );
}
