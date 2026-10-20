import Link from "next/link";

export default function ScanPage() {
  return (
    <main className="min-h-full bg-[#0b2f23] px-4 pt-[calc(env(safe-area-inset-top,0px)+12px)] text-white">
      <div className="mx-auto flex max-w-[440px] flex-col gap-6">
        <Link href="/home" className="py-2.5 text-[17px] text-lime">
          Cancel
        </Link>
        <p className="text-center text-[15px] text-on-hero-muted">Bin scanning is built in Feature 4.</p>
      </div>
    </main>
  );
}
