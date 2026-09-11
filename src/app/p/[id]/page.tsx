// src/app/p/[id]/page.tsx

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, getProducts } from "@/lib/products-server";
import { whatsappLink } from "@/lib/config";
import { SITE_URL, productSchema } from "@/lib/seo";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return { title: "Product not found" };
  }

  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `${SITE_URL}${product.image}`;

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/p/${product.id}`,
    },
    openGraph: {
      type: "website",
      title: `${product.name} — ₦${product.price.toLocaleString("en-NG")}`,
      description: product.description,
      url: `${SITE_URL}/p/${product.id}`,
      images: [{ url: imageUrl, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const all = await getProducts();
  const related = all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="pb-10">
      {/* Product JSON-LD for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema(product)),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 pt-4">
        <nav aria-label="Breadcrumb" className="text-sm mb-3">
          <Link href="/" className="text-brand-600">
            Home
          </Link>
          <span className="text-brand-400 mx-1.5">/</span>
          <span className="text-ink/60">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-brand-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
            {!product.inStock && (
              <span className="absolute top-3 left-3 bg-ink/85 text-white text-xs px-2.5 py-1 rounded-full">
                Out of stock
              </span>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-ink leading-tight">
                {product.name}
              </h1>
              {product.weight && (
                <p className="text-sm text-brand-600 mt-0.5">
                  {product.weight}
                </p>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-brand-700">
                ₦{product.price.toLocaleString("en-NG")}
              </span>
            </div>

            <p className="text-ink/80 leading-relaxed">{product.description}</p>

            <AddToCartButton product={product} />

            <a
              href={whatsappLink(
                `Hi Lashna Foods, I'd like to order: ${product.name} (₦${product.price.toLocaleString("en-NG")})`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-3 rounded-xl border-2 border-green-600 text-green-700 font-semibold active:bg-green-50"
            >
              💬 Order via WhatsApp
            </a>

            <div className="mt-2 pt-4 border-t border-brand-100 text-sm text-brand-700/80 space-y-1.5">
              <div className="flex items-center gap-2">
                <span>🚚</span>
                <span>Fast nationwide delivery or pickup</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💳</span>
                <span>Pay by bank transfer after ordering</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>We confirm your order by phone/WhatsApp</span>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-ink mb-3">
              More from {product.category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}