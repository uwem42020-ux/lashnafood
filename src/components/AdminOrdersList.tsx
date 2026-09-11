// src/components/AdminOrdersList.tsx

"use client";

import { useEffect, useState } from "react";

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

export default function AdminOrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [busyRef, setBusyRef] = useState<string | null>(null);

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
      <div className="text-center py-12 text-brand-600">Loading orders…</div>
    );
  }

  return (
    <>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-4">
        {(["all", "awaiting_confirmation", "paid", "delivered"] as const).map(
          (s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border ${
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
          {filtered.map((order) => (
            <li
              key={order.reference}
              className="bg-white border border-brand-100 rounded-2xl p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="font-bold text-brand-700 tracking-wide">
                    {order.reference}
                  </div>
                  <div className="text-xs text-brand-500">
                    {new Date(order.created_at).toLocaleString("en-NG")}
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>

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
                      ₦{(item.price * item.quantity).toLocaleString("en-NG")}
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
                    disabled={busyRef === order.reference}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-green-600 text-white active:bg-green-700 disabled:opacity-50"
                  >
                    ✓ Mark as Paid
                  </button>
                )}
                {order.status === "paid" && (
                  <button
                    onClick={() => updateStatus(order.reference, "delivered")}
                    disabled={busyRef === order.reference}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-600 text-white active:bg-blue-700 disabled:opacity-50"
                  >
                    📦 Mark as Delivered
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
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-800"
                >
                  💬 WhatsApp Customer
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
                      disabled={busyRef === order.reference}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-red-50 text-red-700 active:bg-red-100 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}