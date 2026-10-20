"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signIn, type FormState } from "@/app/(auth)/actions";
import { FormMessage, TextField } from "@/components/ui/Field";
import { ListGroup } from "@/components/ui/List";
import { SubmitButton } from "./SubmitButton";

export function LoginForm() {
  const [state, action] = useActionState<FormState, FormData>(signIn, null);

  return (
    <form action={action} noValidate className="flex flex-col gap-4">
      <ListGroup>
        <TextField id="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" required />
        <TextField id="password" label="Password" type="password" autoComplete="current-password" placeholder="Your password" required />
      </ListGroup>
      <FormMessage error={state?.error} message={state?.message} />
      <SubmitButton label="Log In" busyLabel="Logging in…" />
      <p className="text-center text-[15px] text-muted">
        New to Nama&apos;?{" "}
        <Link href="/signup" className="font-semibold text-link">
          Create an account
        </Link>
      </p>
    </form>
  );
}
