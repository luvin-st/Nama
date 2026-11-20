import type { MetadataRoute } from "next";

/** Lets phones install NAMA (the restaurant app) to the home screen and open it full-screen. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/restaurant",
    name: "NAMA",
    short_name: "NAMA",
    description: "Log kitchen food waste, request pickups and see what it costs, branch by branch.",
    start_url: "/restaurant",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f2f5ec",
    theme_color: "#0f3d2e",
    lang: "en",
    dir: "ltr",
    categories: ["business", "food", "productivity"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Log a bin", url: "/restaurant", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
      { name: "Owner report", url: "/restaurant/report", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
    ],
  };
}
