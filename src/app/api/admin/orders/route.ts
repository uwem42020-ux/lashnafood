// src/app/api/admin/orders/route.ts

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllOrders } from "@/lib/orders-store";

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await getAllOrders();
    return NextResponse.json({ orders });
  } catch (err) {
    console.error("Admin orders fetch error:", err);
    return NextResponse.json(
      { error: "Could not fetch orders" },
      { status: 500 }
    );
  }
}