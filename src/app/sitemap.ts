// src/app/sitemap.ts

import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products-server";
import { CATEGORIES } from "@/lib/products";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const now = new Date();

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/p/${p.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/category/${c.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...productPages,
    ...categoryPages,
  ];
}