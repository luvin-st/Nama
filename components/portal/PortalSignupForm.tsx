"use client";

import Link from "next/link";
import { portalSignUp, type PortalState } from "@/app/(portal)/actions";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { FormMessage, TextField } from "@/components/ui/Field";
import { ListGroup } from "@/components/ui/Group";
import { SIDE, type Side } from "@/lib/portal";
import { useFormAction } from "@/lib/use-form-action";

/** Restaurant sign-up asks for the company; staff sign-up asks for the staff code. */
export function PortalSignupForm({ side }: { side: Side }) {
  const { state, onSubmit, pending } = useFormAction<PortalState>(portalSignUp, null);

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <input type="hidden" name="side" value={side} />
      <ListGroup>
        <TextField id="name" label="Your name" autoComplete="name" placeholder="Full name" maxLength={60} required />
        {side === "restaurant" ? (
          <TextField id="company" label="Company" autoComplete="organization" placeholder="Restaurant group" maxLength={80} required />
        ) : null}
        <TextField id="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" required />
        <TextField id="password" label="Password" type="password" autoComplete="new-password" placeholder="8+ characters" required />
        {side === "staff" ? (
          <TextField id="code" label="Staff code" autoComplete="off" autoCapitalize="characters" placeholder="From your manager" required />
        ) : null}
      </ListGroup>
      <FormMessage error={state?.error} message={state?.message} />
      <SubmitButton label="Create Account" busyLabel="Creating account…" busy={pending} />
      <p className="text-center text-[15px] text-muted">
        Already have an account?{" "}
        <Link href={SIDE[side].login} className="font-semibold text-link">
          Log in
        </Link>
      </p>
    </form>
  );
}
