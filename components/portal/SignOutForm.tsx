import { portalSignOut } from "@/app/(portal)/actions";
import { Button } from "@/components/ui/Button";

/** Log out and return to the portal. "link" sits in a header; "button" is a full-width button. */
export function SignOutForm({ variant = "link" }: { variant?: "link" | "button" }) {
  return (
    <form action={portalSignOut}>
      {variant === "button" ? (
        <Button type="submit" variant="tint">
          Log Out
        </Button>
      ) : (
        <button type="submit" className="py-2 text-[15px] font-medium text-link">
          Log out
        </button>
      )}
    </form>
  );
}
