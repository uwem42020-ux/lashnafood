// src/components/AdminOrdersList.tsx

"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { OrderCardSkeleton } from "@/components/Skeleton";

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

const STATUS_LABELS: Record<string, string> = {
  awaiting_confirmation: "Awaiting",
  paid: "Paid",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  awaiting_confirmation: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  delivered: "bg-blue-100 text-blue-800",
  cancelled: "bg-red-100 text-red-800",
};

// These statuses auto-collapse
const COLLAPSED_STATUSES = ["delivered", "cancelled"];

export default function AdminOrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [busyRef, setBusyRef] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  async function load() {
    try {
      const res = await fetch("/api/admin/orders");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function updateStatus(reference: string, status: string) {
    setBusyRef(reference);
    try {
      const res = await fetch(`/api/admin/orders/${reference}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      await load();
    } catch (err) {
      alert("Could not update order");
    } finally {
      setBusyRef(null);
    }
  }

  function toggleExpand(reference: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(reference)) next.delete(reference);
      else next.add(reference);
      return next;
    });
  }

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const counts = {
    all: orders.length,
    awaiting_confirmation: orders.filter(
      (o) => o.status === "awaiting_confirmation"
    ).length,
    paid: orders.filter((o) => o.status === "paid").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  if (loading) {
    return (
      <>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-8 w-20 bg-brand-100/60 rounded-full animate-pulse"
            />
          ))}
        </div>
        <ul className="space-y-3">
          <OrderCardSkeleton />
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </ul>
      </>
    );
  }

  return (
    <>
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-4">
        {(["all", "awaiting_confirmation", "paid", "delivered"] as const).map(
          (s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-transform active:scale-95 ${
                filter === s
                  ? "bg-brand-500 text-white border-brand-500"
                  : "bg-white text-brand-700 border-brand-200"
              }`}
            >
              {s === "all" ? "All" : STATUS_LABELS[s]}{" "}
              <span className="opacity-70">
                ({(counts as Record<string, number>)[s]})
              </span>
            </button>
          )
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-brand-500">
          <div className="text-4xl mb-2">📭</div>
          No orders yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((order) => {
            const isCollapsedByDefault = COLLAPSED_STATUSES.includes(
              order.status
            );
            const isExpanded =
              expanded.has(order.reference) || !isCollapsedByDefault;
            const busy = busyRef === order.reference;

            return (
              <li
                key={order.reference}
                className="bg-white border border-brand-100 rounded-2xl overflow-hidden"
              >
                {/* Header — always visible */}
                <button
                  onClick={() => {
                    if (isCollapsedByDefault) toggleExpand(order.reference);
                  }}
                  className={`w-full text-left p-4 ${
                    isCollapsedByDefault ? "cursor-pointer" : "cursor-default"
                  }`}
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {isCollapsedByDefault && (
                          <span
                            className={`text-brand-500 text-xs transition-transform ${
                              isExpanded ? "rotate-90" : ""
                            }`}
                          >
                            ▶
                          </span>
                        )}
                        <span className="font-bold text-brand-700 tracking-wide">
                          {order.reference}
                        </span>
                      </div>
                      <div className="text-xs text-brand-500 mt-0.5">
                        {new Date(order.created_at).toLocaleString("en-NG")}
                      </div>
                      {isCollapsedByDefault && !isExpanded && (
                        <div className="text-sm text-ink mt-1.5">
                          {order.customer_name} ·{" "}
                          <span className="font-bold text-brand-700">
                            ₦{order.subtotal.toLocaleString("en-NG")}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {busy && <Spinner size={14} className="text-brand-500" />}
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          STATUS_COLORS[order.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Body — collapsible */}
                {isExpanded && (
                  <div className="px-4 pb-4 -mt-2">
                    <div className="text-sm text-ink mb-2">
                      <div className="font-medium">{order.customer_name}</div>
                      <div className="text-brand-600">
                        <a href={`tel:${order.phone}`} className="underline">
                          {order.phone}
                        </a>
                      </div>
                    </div>

                    <div className="text-xs text-brand-700 bg-brand-50 rounded-lg p-2.5 mb-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span>
                            {item.name} × {item.quantity}
                          </span>
                          <span>
                            ₦
                            {(item.price * item.quantity).toLocaleString(
                              "en-NG"
                            )}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between font-bold text-brand-800 mt-1.5 pt-1.5 border-t border-brand-200">
                        <span>Total</span>
                        <span>₦{order.subtotal.toLocaleString("en-NG")}</span>
                      </div>
                    </div>

                    <div className="text-xs text-brand-600 mb-3">
                      <span className="font-medium">
                        {order.delivery_type === "pickup"
                          ? "🏬 Pickup"
                          : "🚚 Delivery"}
                        :
                      </span>{" "}
                      {order.delivery_type === "pickup"
                        ? "At store"
                        : order.address}
                      {order.note && (
                        <div className="mt-1 italic">Note: {order.note}</div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {order.status === "awaiting_confirmation" && (
                        <button
                          onClick={() => updateStatus(order.reference, "paid")}
                          disabled={busy}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-green-600 text-white active:scale-95 active:bg-green-700 disabled:opacity-50 transition-transform inline-flex items-center gap-1.5"
                        >
                          {busy ? <Spinner size={12} /> : "✓"} Mark as Paid
                        </button>
                      )}
                      {order.status === "paid" && (
                        <button
                          onClick={() =>
                            updateStatus(order.reference, "delivered")
                          }
                          disabled={busy}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-600 text-white active:scale-95 active:bg-blue-700 disabled:opacity-50 transition-transform inline-flex items-center gap-1.5"
                        >
                          {busy ? <Spinner size={12} /> : "📦"} Mark as
                          Delivered
                        </button>
                      )}
                      <a
                        href={`https://wa.me/234${order.phone.replace(
                          /^0/,
                          ""
                        )}?text=${encodeURIComponent(
                          `Hi ${order.customer_name}, this is Lashna Foods regarding your order ${order.reference}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-800 active:scale-95 transition-transform"
                      >
                        💬 WhatsApp
                      </a>
                      {order.status !== "cancelled" &&
                        order.status !== "delivered" && (
                          <button
                            onClick={() => {
                              if (
                                confirm(
                                  `Cancel order ${order.reference}? This cannot be undone.`
                                )
                              ) {
                                updateStatus(order.reference, "cancelled");
                              }
                            }}
                            disabled={busy}
                            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-red-50 text-red-700 active:scale-95 active:bg-red-100 disabled:opacity-50 transition-transform"
                          >
                            Cancel
                          </button>
                        )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}