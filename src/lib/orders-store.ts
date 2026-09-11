// src/lib/orders-store.ts
// Now backed by Supabase. Same API as before so callers don't change.

import { createAdminClient } from "@/lib/supabase/admin";

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  reference: string;
  customer_name: string;
  phone: string;
  delivery_type: "delivery" | "pickup";
  address: string | null;
  note: string | null;
  items: OrderItem[];
  subtotal: number;
  status: "awaiting_confirmation" | "paid" | "delivered" | "cancelled";
  created_at: string;
  paid_at?: string | null;
}

// Generate a short readable reference: LSH-4821
export function generateReference(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `LSH-${n}`;
}

export async function createOrder(
  order: Omit<Order, "reference" | "created_at" | "status"> & {
    reference?: string;
    status?: Order["status"];
  }
): Promise<Order> {
  const supabase = createAdminClient();

  // Retry on unique-reference collision
  let attempts = 0;
  while (attempts < 5) {
    const reference = order.reference ?? generateReference();
    const { data, error } = await supabase
      .from("orders")
      .insert({
        reference,
        customer_name: order.customer_name,
        phone: order.phone,
        delivery_type: order.delivery_type,
        address: order.address,
        note: order.note,
        items: order.items,
        subtotal: order.subtotal,
        status: order.status ?? "awaiting_confirmation",
      })
      .select()
      .single();

    if (!error && data) {
      return data as Order;
    }

    if (error?.code === "23505") {
      // duplicate reference — try again
      attempts++;
      continue;
    }

    throw new Error(error?.message || "Failed to create order");
  }

  throw new Error("Could not generate unique reference");
}

export async function getOrder(reference: string): Promise<Order | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("reference", reference)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as Order) ?? null;
}

export async function getAllOrders(): Promise<Order[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Order[];
}

export async function updateOrderStatus(
  reference: string,
  status: Order["status"]
): Promise<Order | null> {
  const supabase = createAdminClient();
  const updates: Record<string, unknown> = { status };

  if (status === "paid") {
    updates.paid_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("orders")
    .update(updates)
    .eq("reference", reference)
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as Order) ?? null;
}