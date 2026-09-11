// src/app/manifest.ts

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lashna Foods — Order Fresh Teas & Foods",
    short_name: "Lashna Foods",
    description:
      "Scan, tap, order. Fresh teas and foods delivered across Nigeria. Pay by bank transfer or WhatsApp.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fdfaf5",
    theme_color: "#c46f24",
    categories: ["food", "shopping", "business"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}