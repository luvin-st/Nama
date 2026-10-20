import type { Metadata, Viewport } from "next";
import { RegisterSW } from "@/components/pwa/RegisterSW";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nama'",
  description: "Drop your food scraps, earn grocery rewards and help local farms grow.",
  applicationName: "Nama'",
  appleWebApp: { capable: true, title: "Nama'", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f5ec" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1510" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-full">
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
