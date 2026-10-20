"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, type FormEvent } from "react";
import { QrScanner } from "@/components/scan/QrScanner";
import { Button } from "@/components/ui/Button";
import { FormMessage, TextField } from "@/components/ui/Field";
import { ListGroup } from "@/components/ui/List";
import { parseVoucherCode } from "@/lib/rewards";

/** Type a voucher code, or scan the QR on the resident's phone. */
export function VoucherLookup({ initial }: { initial: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const go = useCallback(
    (text: string) => {
      const code = parseVoucherCode(text);
      if (!code) {
        setError("That isn't a Nama' voucher code. Codes look like NAMA-7KQ4-X2PB.");
        return;
      }
      setError(null);
      setScanning(false);
      setValue(code);
      router.push(`/staff/vouchers?code=${encodeURIComponent(code)}`);
    },
    [router],
  );

  function submit(e: FormEvent) {
    e.preventDefault();
    go(value);
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3">
      <ListGroup>
        <TextField
          label="Code"
          id="code"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="NAMA-7KQ4-X2PB"
          autoComplete="off"
          autoCapitalize="characters"
          className="min-w-0 flex-1 bg-transparent py-3 font-mono text-[17px] uppercase text-ink outline-none placeholder:normal-case placeholder:text-muted"
        />
      </ListGroup>
      <FormMessage error={error ?? undefined} />
      {scanning ? (
        <div className="rounded-[22px] bg-scan p-4">
          <QrScanner onCode={go} />
        </div>
      ) : null}
      <div className="grid grid-cols-2 gap-3">
        <Button type="submit">Find</Button>
        <Button variant="tint" onClick={() => setScanning((s) => !s)}>
          {scanning ? "Stop Camera" : "Scan QR"}
        </Button>
      </div>
    </form>
  );
}
