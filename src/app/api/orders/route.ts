// src/app/api/orders/route.ts

import { NextResponse } from "next/server";
import {
  createOrder,
  getOrder,
  type Order,
} from "@/lib/orders-store";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      customer_name,
      phone,
      delivery_type,
      address,
      note,
      items,
      subtotal,
    } = body;

    if (!customer_name || !phone || !items?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const order = await createOrder({
      customer_name,
      phone,
      delivery_type,
      address: address ?? null,
      note: note ?? null,
      items,
      subtotal,
    });

    console.log(`✅ Order placed: ${order.reference} — ${customer_name}`);

    return NextResponse.json({ reference: order.reference, order });
  } catch (err) {
    console.error("Order error:", err);
    return NextResponse.json(
      { error: "Could not create order" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref");
  if (!ref) return NextResponse.json({ error: "No ref" }, { status: 400 });

  try {
    const order = await getOrder(ref);
    if (!order) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ order });
  } catch (err) {
    console.error("Fetch order error:", err);
    return NextResponse.json(
      { error: "Could not fetch order" },
      { status: 500 }
    );
  }
}