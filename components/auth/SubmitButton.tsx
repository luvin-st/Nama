"use client";

import { useFormStatus } from "react-dom";
import { Button, type Variant } from "@/components/ui/Button";

/** Form submit button that shows a busy label while the form is sending. */
type Props = { label: string; busyLabel: string; variant?: Variant; disabled?: boolean };

export function SubmitButton({ label, busyLabel, variant, disabled = false }: Props) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} disabled={pending || disabled} aria-busy={pending}>
      {pending ? busyLabel : label}
    </Button>
  );
}
