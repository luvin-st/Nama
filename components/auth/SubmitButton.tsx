"use client";

import { useFormStatus } from "react-dom";
import { Button, type Variant } from "@/components/ui/Button";

/** Form submit button that shows a busy label while the form is sending. */
type Props = { label: string; busyLabel: string; variant?: Variant; disabled?: boolean; busy?: boolean };

export function SubmitButton({ label, busyLabel, variant, disabled = false, busy = false }: Props) {
  const status = useFormStatus();
  const pending = status.pending || busy;
  return (
    <Button type="submit" variant={variant} disabled={pending || disabled} aria-busy={pending}>
      {pending ? busyLabel : label}
    </Button>
  );
}
