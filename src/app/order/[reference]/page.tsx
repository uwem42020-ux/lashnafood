// src/app/order/[reference]/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { whatsappLink } from "@/lib/config";

interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  reference: string;
  customer_name: string;
  phone: string;
  delivery_type: "delivery" | "pickup";
  address: string | null;
  note: string | null;
  items: OrderItem[];
  subtotal: number;
  status: string;
  created_at: string;
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      const el = document.createElement("textarea");
      el.value = value;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  return (
    <button
      onClick={copy}
      className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
        copied
          ? "bg-green-600 text-white"
          : "bg-brand-500 text-white active:bg-brand-600"
      }`}
      aria-label={`Copy ${label}`}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

export default function OrderPage() {
  const params = useParams();
  const reference = params.reference as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [markedSent, setMarkedSent] = useState(false);

  // Load order
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/orders?ref=${reference}`);
        if (!res.ok) throw new Error("Order not found");
        const data = await res.json();
        setOrder(data.order);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load order");
      } finally {
        setLoading(false);
      }
    }
    if (reference) load();
  }, [reference]);

  // Load settings (bank details)
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings || {}))
      .catch(() => {});
  }, []);

  if (loading) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="text-brand-600">Loading your order…</div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="text-5xl mb-3">😕</div>
        <h1 className="text-xl font-bold text-ink mb-2">Order not found</h1>
        <p className="text-brand-600 mb-6">
          We couldn&apos;t find this order. Please check the link or contact us.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded-full bg-brand-500 text-white font-semibold"
        >
          Back to shop
        </Link>
      </main>
    );
  }

  const whatsappMessage = `Hi Lashna Foods, I've just placed order ${order.reference}.

Name: ${order.customer_name}
Amount: ₦${order.subtotal.toLocaleString("en-NG")}

I'm sending my payment receipt now.`;

  const bankName = settings.bank_name || "—";
  const bankAccountNumber = settings.bank_account_number || "—";
  const bankAccountName = settings.bank_account_name || "—";
  const confirmationWindow = settings.confirmation_window || "a short while";
  const whatsappDisplay = settings.whatsapp_number || "our WhatsApp";

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 pb-12">
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">✅</div>
        <h1 className="text-xl font-bold text-ink">Order placed!</h1>
        <p className="text-sm text-brand-600 mt-1">
          Complete your payment below to confirm.
        </p>
      </div>

      <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 mb-5">
        <div className="text-xs text-brand-600 mb-1">
          Your order reference
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-2xl font-bold text-brand-700 tracking-wide">
            {order.reference}
          </span>
          <CopyButton value={order.reference} label="reference" />
        </div>
        <p className="text-xs text-brand-600 mt-2">
          Include this reference in your transfer narration.
        </p>
      </div>

      <section className="bg-white border border-brand-100 rounded-2xl p-4 mb-5">
        <h2 className="font-bold text-ink mb-3 flex items-center gap-2">
          <span>💳</span> Transfer to
        </h2>

        <div className="space-y-3">
          <div>
            <div className="text-xs text-brand-600 mb-0.5">Bank</div>
            <div className="font-semibold text-ink">{bankName}</div>
          </div>

          <div>
            <div className="text-xs text-brand-600 mb-0.5">
              Account number
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono font-bold text-lg text-ink tracking-wider">
                {bankAccountNumber}
              </span>
              <CopyButton
                value={bankAccountNumber}
                label="account number"
              />
            </div>
          </div>

          <div>
            <div className="text-xs text-brand-600 mb-0.5">
              Account name
            </div>
            <div className="font-semibold text-ink">{bankAccountName}</div>
          </div>

          <div className="pt-3 border-t border-brand-100">
            <div className="text-xs text-brand-600 mb-0.5">Amount</div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-2xl font-bold text-brand-700">
                ₦{order.subtotal.toLocaleString("en-NG")}
              </span>
              <CopyButton
                value={order.subtotal.toString()}
                label="amount"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white border border-brand-100 rounded-2xl p-4 mb-5">
        <h2 className="font-bold text-ink mb-3">Order summary</h2>
        <ul className="space-y-1.5 text-sm">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between gap-3">
              <span className="text-ink/80">
                {item.name}{" "}
                <span className="text-brand-500">× {item.quantity}</span>
              </span>
              <span className="font-medium text-ink shrink-0">
                ₦{(item.price * item.quantity).toLocaleString("en-NG")}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 pt-3 border-t border-brand-100 text-xs text-brand-600 space-y-1">
          <div>
            <span className="font-medium">Delivery:</span>{" "}
            {order.delivery_type === "pickup"
              ? "Pickup at store"
              : order.address}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {order.phone}
          </div>
        </div>
      </section>

      <div className="space-y-3">
        <a
          href={whatsappLink(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3.5 rounded-xl bg-green-600 text-white font-semibold active:bg-green-700"
        >
          💬 Send Receipt on WhatsApp
        </a>

        {!markedSent ? (
          <button
            onClick={() => setMarkedSent(true)}
            className="block w-full text-center py-3.5 rounded-xl border-2 border-brand-500 text-brand-700 font-semibold active:bg-brand-50"
          >
            ✓ I&apos;ve Sent the Payment
          </button>
        ) : (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 text-sm text-center">
            <div className="font-semibold mb-1">Thanks! 🎉</div>
            We&apos;ll confirm your payment within{" "}
            <strong>{confirmationWindow}</strong> and send you an SMS.
          </div>
        )}
      </div>

      <p className="text-xs text-brand-500 text-center mt-6 leading-relaxed">
        Save your order reference <strong>{order.reference}</strong>.<br />
        Need help? Chat with us on WhatsApp — {whatsappDisplay}
      </p>
    </main>
  );
}