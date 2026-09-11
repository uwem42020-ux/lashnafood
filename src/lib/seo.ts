// src/lib/seo.ts

import { BUSINESS } from "@/lib/config";

export const SITE_URL = `https://${BUSINESS.domain}`;
export const SITE_NAME = BUSINESS.name;
export const SITE_DESCRIPTION =
  "Order Arabian tea, hibiscus tea, masala chai and more. Scan, tap, and pay by transfer. Delivered across Nigeria.";

export const DEFAULT_KEYWORDS = [
  "Arabian tea Nigeria",
  "hibiscus tea Lagos",
  "Masala chai Nigeria",
  "buy tea online Nigeria",
  "zobo tea buy online",
  "Lashna Foods",
];

/**
 * Organization schema (JSON-LD) — appears on homepage.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512.png`,
    description: SITE_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lagos",
      addressCountry: "NG",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: BUSINESS.phone,
      contactType: "customer service",
      areaServed: "NG",
      availableLanguage: ["English"],
    },
  };
}

/**
 * WebSite schema — with SearchAction so Google shows a search box.
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Product schema (JSON-LD) — one per product page.
 */
export function productSchema(product: {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  inStock: boolean;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image.startsWith("http")
      ? product.image
      : `${SITE_URL}${product.image}`,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/p/${product.id}`,
      priceCurrency: "NGN",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
  };
}