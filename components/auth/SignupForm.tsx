"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp, type FormState } from "@/app/(auth)/actions";
import { FormMessage, SelectField, TextField } from "@/components/ui/Field";
import { ListGroup } from "@/components/ui/List";
import type { BuildingOption } from "@/lib/data/buildings";
import { SubmitButton } from "./SubmitButton";

export function SignupForm({ buildings }: { buildings: BuildingOption[] }) {
  const [state, action] = useActionState<FormState, FormData>(signUp, null);

  return (
    <form action={action} noValidate className="flex flex-col gap-4">
      <ListGroup>
        <TextField id="name" label="Name" autoComplete="given-name" placeholder="Your first name" maxLength={60} required />
        <TextField id="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" required />
        <TextField id="password" label="Password" type="password" autoComplete="new-password" placeholder="At least 8 characters" minLength={8} required />
      </ListGroup>
      <ListGroup>
        <SelectField id="building_id" label="Building" defaultValue="" required>
          <option value="" disabled>
            Choose your building
          </option>
          {buildings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </SelectField>
        <TextField id="flat" label="Flat" inputMode="numeric" placeholder="e.g. 1204" maxLength={6} required />
      </ListGroup>
      <ListGroup>
        <label htmlFor="agree" className="flex items-start gap-3 px-4 py-3.5 text-[15px] leading-snug">
          <input id="agree" name="agree" type="checkbox" className="mt-0.5 size-[22px] shrink-0 accent-[#2f7a4d]" />
          <span>I&apos;ll only put food scraps in the Nama&apos; bin. Contaminated deposits don&apos;t earn points.</span>
        </label>
      </ListGroup>
      <FormMessage error={state?.error} message={state?.message} />
      <SubmitButton label="Create Account" busyLabel="Creating your account…" />
      <p className="text-center text-[15px] text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-link">
          Log in
        </Link>
      </p>
    </form>
  );
}
