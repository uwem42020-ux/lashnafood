// src/app/api/admin/products/route.ts

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data ?? [] });
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const {
      id,
      name,
      price,
      category,
      description,
      image,
      thumb,
      weight,
      in_stock,
      featured,
    } = body;

    if (!name || !price || !image || !thumb) {
      return NextResponse.json(
        { error: "Name, price, and image are required" },
        { status: 400 }
      );
    }

    // Auto-slug or use provided id
    const productId = id?.trim() || slugify(name);

    // Find next sort_order
    const supabase = createAdminClient();
    const { data: maxRow } = await supabase
      .from("products")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextSort = (maxRow?.sort_order ?? 0) + 1;

    const { data, error } = await supabase
      .from("products")
      .insert({
        id: productId,
        name: name.trim(),
        price: parseInt(price),
        category: category || "tea",
        description: description?.trim() || null,
        image,
        thumb,
        weight: weight?.trim() || null,
        in_stock: in_stock ?? true,
        featured: featured ?? false,
        sort_order: nextSort,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: `Product ID "${productId}" already exists` },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product: data });
  } catch (err) {
    console.error("Create product error:", err);
    return NextResponse.json(
      { error: "Could not create product" },
      { status: 500 }
    );
  }
}