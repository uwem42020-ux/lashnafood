// src/app/cart/page.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cart";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="text-5xl mb-3">🛒</div>
        <h1 className="text-xl font-bold text-ink mb-2">Your cart is empty</h1>
        <p className="text-brand-600 mb-6">
          Add some products to get started.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded-full bg-brand-500 text-white font-semibold"
        >
          Browse products
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 pb-32">
      <h1 className="text-xl font-bold text-ink mb-4">
        Your Cart ({items.length})
      </h1>

      <ul className="space-y-3">
        {items.map(({ product, quantity }) => (
          <li
            key={product.id}
            className="flex gap-3 bg-white border border-brand-100 rounded-xl p-3"
          >
            <Link
              href={`/p/${product.id}`}
              className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-brand-50"
            >
              <Image
                src={product.thumb}
                alt={product.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </Link>
            <div className="flex-1 min-w-0 flex flex-col">
              <Link
                href={`/p/${product.id}`}
                className="font-medium text-ink text-sm line-clamp-2"
              >
                {product.name}
              </Link>
              <div className="text-brand-700 font-bold text-sm mt-1">
                ₦{(product.price * quantity).toLocaleString("en-NG")}
              </div>
              <div className="mt-auto flex items-center gap-2 pt-2">
                <button
                  onClick={() =>
                    updateQuantity(product.id, quantity - 1)
                  }
                  className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold"
                  aria-label="Decrease"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(product.id, quantity + 1)
                  }
                  className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 font-bold"
                  aria-label="Increase"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(product.id)}
                  className="ml-auto text-xs text-accent-500 font-medium"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Sticky checkout bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-cream border-t border-brand-100 p-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="flex-1">
            <div className="text-xs text-brand-600">Total</div>
            <div className="text-lg font-bold text-brand-700">
              ₦{total.toLocaleString("en-NG")}
            </div>
          </div>
          <Link
            href="/checkout"
            className="px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold active:bg-brand-700"
          >
            Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}