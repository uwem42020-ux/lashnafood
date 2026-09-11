// src/app/api/admin/products/[id]/route.ts

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, { params }: Params) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const allowed = [
    "name",
    "price",
    "category",
    "description",
    "weight",
    "in_stock",
    "featured",
    "sort_order",
  ] as const;

  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product: data });
}

export async function DELETE(req: Request, { params }: Params) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") || "soft";

  const supabase = createAdminClient();

  if (mode === "hard") {
    // Find all files that start with this product id (any timestamp)
    const { data: files } = await supabase.storage
      .from("product-images")
      .list("", { search: id });

    const paths = (files ?? [])
      .map((f) => f.name)
      .filter((name) => name.startsWith(id));

    if (paths.length > 0) {
      await supabase.storage.from("product-images").remove(paths);
    }

    // Delete the product row
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, mode: "hard" });
  }

  // Soft delete — mark out of stock
  const { data, error } = await supabase
    .from("products")
    .update({
      in_stock: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, mode: "soft", product: data });
}