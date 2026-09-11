// src/lib/products.ts

import type { Product, Category } from '@/types/product';

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'tea', label: 'Teas' },
  { id: 'food', label: 'Foods' },
  { id: 'combo', label: 'Combos & Packs' },
  { id: 'bulk', label: 'Bulk Sizes' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'arabian-tea',
    name: 'Arabian Tea',
    price: 2500,
    category: 'tea',
    description: 'Rich, aromatic Arabian tea — perfect for morning or evening.',
    image: '/images/arabian-tea.webp',
    thumb: '/images/arabian-tea-thumb.webp',
    inStock: true,
    featured: true,
  },
  {
    id: 'arabian-tea-1-liter',
    name: 'Arabian Tea 1 Liter',
    price: 4500,
    category: 'bulk',
    description: 'Family-size 1L bottle of our signature Arabian tea.',
    image: '/images/arabian-tea-1-liter.webp',
    thumb: '/images/arabian-tea-1-liter-thumb.webp',
    weight: '1L',
    inStock: true,
    featured: true,
  },
  {
    id: 'arabian-tea-5-liters',
    name: 'Arabian Tea 5 Liters',
    price: 18500,
    category: 'bulk',
    description: 'Bulk 5L pack — best value for homes and events.',
    image: '/images/arabian-tea-5liters.webp',
    thumb: '/images/arabian-tea-5liters-thumb.webp',
    weight: '5L',
    inStock: true,
  },
  {
    id: 'arabian-tea-combo',
    name: 'Arabian Tea Combo',
    price: 6800,
    category: 'combo',
    description: 'Two Arabian Tea packs bundled at a discount.',
    image: '/images/arabian-tea-combo.webp',
    thumb: '/images/arabian-tea-combo-thumb.webp',
    inStock: true,
    featured: true,
  },
  {
    id: 'arabian-tea-and-hibiscus-tea',
    name: 'Arabian Tea & Hibiscus Tea',
    price: 4800,
    category: 'combo',
    description: 'A refreshing duo — Arabian tea paired with zobo-style hibiscus.',
    image: '/images/arabian-tea-and-hibiscus-tea.webp',
    thumb: '/images/arabian-tea-and-hibiscus-tea-thumb.webp',
    inStock: true,
    featured: true,
  },
  {
    id: 'arabian-tea-and-hibiscus-tea-3-packs',
    name: 'Arabian Tea & Hibiscus Tea (3 Packs)',
    price: 12500,
    category: 'combo',
    description: 'Three packs of our Arabian & Hibiscus blend. Great for gifting.',
    image: '/images/arabian-tea-and-hibiscus-tea-3-packs.webp',
    thumb: '/images/arabian-tea-and-hibiscus-tea-3-packs-thumb.webp',
    inStock: true,
  },
  {
    id: 'hibiscus-tea',
    name: 'Hibiscus Tea',
    price: 2200,
    category: 'tea',
    description: 'Naturally caffeine-free hibiscus tea — tangy, refreshing, rich in vitamin C.',
    image: '/images/hibiscus-tea.webp',
    thumb: '/images/hibiscus-tea-thumb.webp',
    inStock: true,
    featured: true,
  },
  {
    id: 'hibiscus-tea-2-pack',
    name: 'Hibiscus Tea (2-Pack)',
    price: 4000,
    category: 'combo',
    description: 'Two packs of our popular hibiscus tea — save ₦400.',
    image: '/images/hibiscus-tea-2-pack.webp',
    thumb: '/images/hibiscus-tea-2-pack-thumb.webp',
    inStock: true,
  },
  {
    id: 'masala-karak-chai',
    name: 'Masala Karak Chai',
    price: 3200,
    category: 'tea',
    description: 'Spiced milk tea with cardamom, ginger and clove. Authentic karak chai.',
    image: '/images/masala-karak-chai.webp',
    thumb: '/images/masala-karak-chai-thumb.webp',
    inStock: true,
    featured: true,
  },
];

// Helpers

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function getProductsByCategory(category: Category): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getAllCategories(): Category[] {
  return Array.from(new Set(PRODUCTS.map((p) => p.category)));
}