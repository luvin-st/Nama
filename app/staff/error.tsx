"use client";

import { StaffPage } from "@/components/staff/StaffPage";
import { Notice } from "@/components/ui/Bits";
import { Button } from "@/components/ui/Button";
import { ListGroup } from "@/components/ui/List";

/** Shown if a staff screen crashes unexpectedly. */
export default function StaffError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <StaffPage title="Staff" backHref="/profile">
      <ListGroup>
        <Notice tone="error">Something went wrong loading this page. Nothing was changed.</Notice>
      </ListGroup>
      <Button onClick={reset}>Try Again</Button>
    </StaffPage>
  );
}
