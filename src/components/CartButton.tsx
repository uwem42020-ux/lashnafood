// src/components/CartButton.tsx

"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cart";

export default function CartButton() {
  const count = useCartStore((s) =>
    s.items.reduce((sum, item) => sum + item.quantity, 0)
  );

  return (
    <Link
      href="/cart"
      className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-500 text-white text-sm font-medium active:bg-brand-600"
      aria-label={`Cart, ${count} items`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      <span>Cart</span>
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-accent-500 text-white text-[10px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}