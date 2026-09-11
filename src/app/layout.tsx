// src/app/layout.tsx

import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OfflineBanner from "@/components/OfflineBanner";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  DEFAULT_KEYWORDS,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lashna Foods — Fresh Teas & Foods, Delivered",
    template: "%s | Lashna Foods",
  },
  description: SITE_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Lashna Foods — Fresh Teas & Foods, Delivered",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/banner.webp",
        width: 1200,
        height: 630,
        alt: "Lashna Foods — teas and foods delivered across Nigeria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lashna Foods — Fresh Teas & Foods",
    description: SITE_DESCRIPTION,
    images: ["/images/banner.webp"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  formatDetection: {
    telephone: true,
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#c46f24",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema()),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
        <OfflineBanner />
      </body>
    </html>
  );
}