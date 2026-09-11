// src/app/page.tsx

import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/products-server";
import { CATEGORIES } from "@/lib/products";
import { SITE_URL, SITE_DESCRIPTION } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Lashna Foods — Fresh Teas & Foods, Delivered Across Nigeria",
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Lashna Foods — Fresh Teas & Foods, Delivered",
    description: SITE_DESCRIPTION,
    images: [{ url: "/images/banner.webp", alt: "Lashna Foods" }],
  },
};

export default async function Home() {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured);

  return (
    <main className="pb-8">
      {/* Hero / Banner */}
      <section className="relative">
        <div className="relative w-full aspect-[16/9] max-h-[360px] overflow-hidden bg-black">
          <Image
            src="/images/banner.webp"
            alt="Lashna Foods — fresh teas and foods"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />

          {/* Very dark green overlay — image barely visible through it */}
          <div className="absolute inset-0 bg-green-950/85" />

          {/* Subtle bottom vignette for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 text-white">
            <h1 className="text-2xl sm:text-4xl font-bold leading-tight max-w-2xl drop-shadow-lg">
              Fresh teas &amp; foods, <br />
              delivered across Nigeria.
            </h1>
            <p className="text-sm sm:text-lg text-white/95 mt-2 max-w-xl drop-shadow">
              Order in under 60 seconds. Pay by transfer or WhatsApp.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <a
                href="#products"
                className="px-5 py-2.5 rounded-full bg-white text-green-950 text-sm font-semibold active:scale-95 transition-transform"
              >
                Shop Now
              </a>
              <a
                href="https://wa.me/2348036772195?text=Hi%20Lashna%20Foods%2C%20I%27d%20like%20to%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-green-600 text-white text-sm font-semibold active:scale-95 transition-transform"
              >
                💬 Order via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 mt-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat.id).length;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="shrink-0 px-4 py-2 rounded-full bg-white border border-brand-200 text-sm font-medium text-brand-700 active:bg-brand-50"
              >
                {cat.label}
                <span className="ml-1.5 text-brand-400 text-xs">{count}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-lg font-bold text-ink">Featured</h2>
          <span className="text-xs text-brand-600">{featured.length} items</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {featured.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={i < 2}
            />
          ))}
        </div>
      </section>

      {/* All Products */}
      <section id="products" className="max-w-6xl mx-auto px-4 mt-10">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-lg font-bold text-ink">All Products</h2>
          <span className="text-xs text-brand-600">{products.length} items</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust Strip */}
      <section className="max-w-6xl mx-auto px-4 mt-12">
        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-brand-600 text-lg">🚚</span>
            <div>
              <div className="font-semibold text-ink">Fast delivery</div>
              <div className="text-brand-700/80 text-xs">
                Nationwide delivery, pickup available
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-brand-600 text-lg">💳</span>
            <div>
              <div className="font-semibold text-ink">Bank transfer</div>
              <div className="text-brand-700/80 text-xs">
                Simple transfer, no card needed
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-brand-600 text-lg">💬</span>
            <div>
              <div className="font-semibold text-ink">WhatsApp orders</div>
              <div className="text-brand-700/80 text-xs">
                Prefer to chat? Order via WhatsApp
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}