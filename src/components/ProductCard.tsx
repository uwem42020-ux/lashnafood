// src/components/ProductCard.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types/product";
import { useCartStore } from "@/store/cart";

interface Props {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <Link
      href={`/p/${product.id}`}
      className="group bg-white rounded-xl overflow-hidden border border-brand-100 flex flex-col active:scale-[0.98] transition-transform"
    >
      {/* Image */}
      <div className="relative aspect-square bg-brand-50">
        <Image
          src={product.thumb}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />
        {!product.inStock && (
          <span className="absolute top-2 left-2 bg-ink/80 text-white text-[10px] px-2 py-0.5 rounded-full">
            Out of stock
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 flex-1 flex flex-col gap-1">
        <h3 className="text-sm font-medium text-ink leading-tight line-clamp-2">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <span className="text-brand-700 font-bold text-sm">
            ₦{product.price.toLocaleString("en-NG")}
          </span>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.inStock}
            aria-label={`Add ${product.name} to cart`}
            className={`shrink-0 text-xs font-semibold rounded-full px-2.5 py-1 transition-colors ${
              added
                ? "bg-green-600 text-white"
                : "bg-brand-500 text-white active:bg-brand-600 disabled:bg-brand-200"
            }`}
          >
            {added ? "✓" : "+ Add"}
          </button>
        </div>
      </div>
    </Link>
  );
}