// src/app/api/admin/orders/[reference]/route.ts

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { updateOrderStatus, getOrder, type Order } from "@/lib/orders-store";

interface Params {
  params: Promise<{ reference: string }>;
}

const VALID_STATUSES: Order["status"][] = [
  "awaiting_confirmation",
  "paid",
  "delivered",
  "cancelled",
];

export async function PATCH(req: Request, { params }: Params) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reference } = await params;
  const { status } = await req.json();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const existing = await getOrder(reference);
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updated = await updateOrderStatus(reference, status);
    return NextResponse.json({ order: updated });
  } catch (err) {
    console.error("Update order error:", err);
    return NextResponse.json(
      { error: "Could not update order" },
      { status: 500 }
    );
  }
}