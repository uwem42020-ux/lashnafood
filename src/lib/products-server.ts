// src/lib/products-server.ts
// Fetches products from Supabase. Falls back to static data on failure.

import { createAdminClient } from "@/lib/supabase/admin";
import { PRODUCTS as FALLBACK_PRODUCTS } from "@/lib/products";
import type { Product, Category } from "@/types/product";

interface DBProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string | null;
  image: string;
  thumb: string;
  weight: string | null;
  in_stock: boolean;
  featured: boolean;
  sort_order: number;
}

function toProduct(row: DBProduct): Product {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    category: row.category as Category,
    description: row.description ?? "",
    image: row.image,
    thumb: row.thumb,
    weight: row.weight ?? undefined,
    inStock: row.in_stock,
    featured: row.featured,
  };
}

export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("Supabase products empty or failed, using fallback");
      return FALLBACK_PRODUCTS;
    }

    return (data as DBProduct[]).map(toProduct);
  } catch (err) {
    console.error("getProducts error, using fallback:", err);
    return FALLBACK_PRODUCTS;
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return FALLBACK_PRODUCTS.find((p) => p.id === id) ?? null;
    }

    return toProduct(data as DBProduct);
  } catch (err) {
    return FALLBACK_PRODUCTS.find((p) => p.id === id) ?? null;
  }
}