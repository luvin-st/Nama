"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";

/** Form submit button that shows a busy label while the form is sending. */
export function SubmitButton({ label, busyLabel }: { label: string; busyLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} aria-busy={pending}>
      {pending ? busyLabel : label}
    </Button>
  );
}
