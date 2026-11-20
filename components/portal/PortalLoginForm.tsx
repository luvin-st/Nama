"use client";

import Link from "next/link";
import { portalSignIn, type PortalState } from "@/app/(portal)/actions";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { FormMessage, TextField } from "@/components/ui/Field";
import { ListGroup } from "@/components/ui/Group";
import { SIDE, type Side } from "@/lib/portal";
import { useFormAction } from "@/lib/use-form-action";

export function PortalLoginForm({ side, next }: { side: Side; next: string | null }) {
  const { state, onSubmit, pending } = useFormAction<PortalState>(portalSignIn, null);

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <ListGroup>
        <TextField id="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" required />
        <TextField id="password" label="Password" type="password" autoComplete="current-password" placeholder="Your password" required />
      </ListGroup>
      <FormMessage error={state?.error} message={state?.message} />
      <SubmitButton label="Log In" busyLabel="Logging in…" busy={pending} />
      <p className="text-center text-[15px] text-muted">
        New here?{" "}
        <Link href={SIDE[side].signup} className="font-semibold text-link">
          Create an account
        </Link>
      </p>
    </form>
  );
}
