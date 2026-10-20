import type { MetadataRoute } from "next";

/** Lets phones install Nama' to the home screen and open it full-screen. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/home",
    name: "Nama' | نماء",
    short_name: "Nama'",
    description: "Drop your food scraps, earn grocery rewards and help local farms grow.",
    start_url: "/home",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f2f5ec",
    theme_color: "#0f3d2e",
    lang: "en",
    dir: "ltr",
    categories: ["lifestyle", "utilities"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Drop Scraps", short_name: "Scan", url: "/scan", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Rewards", url: "/rewards", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
