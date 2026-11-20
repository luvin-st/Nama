"use client";

/** Shown if a restaurant screen crashes unexpectedly. */
export default function RestaurantError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert" className="flex flex-col gap-3 rounded-[18px] bg-white p-5 text-center">
      <p className="text-[15px] text-k-orange">Something went wrong loading this screen.</p>
      <button type="button" onClick={reset} className="h-12 rounded-[14px] bg-k-mint text-[16px] font-semibold text-k-forest">
        Try again
      </button>
    </div>
  );
}
