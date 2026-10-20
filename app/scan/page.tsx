import type { Metadata } from "next";
import { ScanPicker } from "@/components/scan/ScanPicker";
import { ScanHeading, ScanShell } from "@/components/scan/ScanShell";
import { ScanSteps } from "@/components/scan/ScanSteps";

export const metadata: Metadata = { title: "Scan Bin · Nama'" };

export default function ScanPage() {
  return (
    <ScanShell title="Scan Bin">
      <ScanHeading title="Point at the bin's code" text="You'll find the QR sticker on the lid of your building's Nama' bin." />
      <ScanPicker />
      <ScanSteps active={0} />
    </ScanShell>
  );
}
