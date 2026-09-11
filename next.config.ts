// next.config.ts

import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "supabase-images",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          },
        },
      },
      {
        urlPattern: /^\/_next\/image\?.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "next-images",
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          },
        },
      },
    ],
  },
});

const nextConfig: NextConfig = {
  // Silence Turbopack/webpack conflict warning.
  // The PWA plugin uses webpack only during `npm run build` (non-dev).
  turbopack: {},

  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "diuicmjfjhgjlwvubcpk.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default withPWA(nextConfig);