// src/app/checkout/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { BUSINESS } from "@/lib/config";

type DeliveryType = "delivery" | "pickup";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12 text-center">
        <h1 className="text-xl font-bold text-ink mb-3">
          Nothing to checkout
        </h1>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded-full bg-brand-500 text-white font-semibold"
        >
          Browse products
        </Link>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!name.trim()) return setError("Please enter your name");
    if (!/^0\d{10}$/.test(phone.trim().replace(/\s/g, ""))) {
      return setError("Enter a valid Nigerian phone number (e.g. 08012345678)");
    }
    if (deliveryType === "delivery" && !address.trim()) {
      return setError("Please enter a delivery address");
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name.trim(),
          phone: phone.trim().replace(/\s/g, ""),
          delivery_type: deliveryType,
          address: deliveryType === "delivery" ? address.trim() : null,
          note: note.trim() || null,
          items: items.map((i) => ({
            product_id: i.product.id,
            name: i.product.name,
            price: i.product.price,
            quantity: i.quantity,
          })),
          subtotal,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not place order");
      }

      const data = await res.json();
      clearCart();
      router.push(`/order/${data.reference}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 pb-40">
      <Link
        href="/cart"
        className="inline-flex items-center text-sm text-brand-600 mb-3"
      >
        ← Back to cart
      </Link>

      <h1 className="text-xl font-bold text-ink mb-1">Checkout</h1>
      <p className="text-sm text-brand-600 mb-5">
        We&apos;ll confirm your order by phone/WhatsApp.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Full name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Chinedu Okafor"
            className="w-full px-3 py-2.5 rounded-xl border border-brand-200 bg-white focus:outline-none focus:border-brand-500"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Phone number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 08012345678"
            inputMode="numeric"
            pattern="0[0-9]{10}"
            className="w-full px-3 py-2.5 rounded-xl border border-brand-200 bg-white focus:outline-none focus:border-brand-500"
            required
          />
          <p className="text-xs text-brand-500 mt-1">
            We&apos;ll send your order confirmation here.
          </p>
        </div>

        {/* Delivery type */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            How would you like to receive it?
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDeliveryType("delivery")}
              className={`py-3 rounded-xl font-medium border-2 transition-colors ${
                deliveryType === "delivery"
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-brand-100 bg-white text-brand-600"
              }`}
            >
              🚚 Delivery
            </button>
            <button
              type="button"
              onClick={() => setDeliveryType("pickup")}
              className={`py-3 rounded-xl font-medium border-2 transition-colors ${
                deliveryType === "pickup"
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-brand-100 bg-white text-brand-600"
              }`}
            >
              🏬 Pickup
            </button>
          </div>
        </div>

        {/* Address (only if delivery) */}
        {deliveryType === "delivery" && (
          <div>
            <label className="block text-sm font-medium text-ink mb-1">
              Delivery address
            </label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, area, city, state"
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-brand-200 bg-white focus:outline-none focus:border-brand-500 resize-none"
              required
            />
          </div>
        )}

        {/* Note */}
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Order note <span className="text-brand-400">(optional)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any special instructions?"
            rows={2}
            className="w-full px-3 py-2.5 rounded-xl border border-brand-200 bg-white focus:outline-none focus:border-brand-500 resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-3 py-2">
            {error}
          </div>
        )}

        {/* Sticky submit */}
        <div className="fixed bottom-0 left-0 right-0 bg-cream border-t border-brand-100 p-3">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <div className="flex-1">
              <div className="text-xs text-brand-600">Total</div>
              <div className="text-lg font-bold text-brand-700">
                ₦{subtotal.toLocaleString("en-NG")}
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold active:bg-brand-700 disabled:bg-brand-300"
            >
              {submitting ? "Placing…" : "Place Order"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}