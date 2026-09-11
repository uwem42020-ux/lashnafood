// src/components/AddToCartButton.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";
import { useCartStore } from "@/store/cart";

export default function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    addItem(product);
    router.push("/cart");
  }

  if (!product.inStock) {
    return (
      <button
        disabled
        className="w-full py-3 rounded-xl bg-brand-100 text-brand-400 font-semibold cursor-not-allowed"
      >
        Out of stock
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleBuyNow}
        className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold active:bg-brand-700"
      >
        Buy Now
      </button>
      <button
        onClick={handleAdd}
        className={`w-full py-3 rounded-xl font-semibold transition-colors ${
          added
            ? "bg-green-600 text-white"
            : "bg-brand-50 text-brand-700 border border-brand-200 active:bg-brand-100"
        }`}
      >
        {added ? "✓ Added to cart" : "Add to Cart"}
      </button>
    </div>
  );
}