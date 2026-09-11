// src/types/product.ts

export type Category = 'tea' | 'food' | 'combo' | 'bulk';

export interface Product {
  id: string;              // URL slug, e.g. "arabian-tea"
  name: string;            // Display name
  price: number;           // In Naira (not kobo — we'll format it)
  category: Category;
  description: string;     // Short — 1-2 sentences
  image: string;           // Path in /public, e.g. "/images/arabian-tea.webp"
  thumb: string;           // Thumbnail path
  weight?: string;         // e.g. "500g", "1L", "5L"
  inStock: boolean;
  featured?: boolean;      // Shows on homepage
}

export interface CartItem {
  product: Product;
  quantity: number;
}