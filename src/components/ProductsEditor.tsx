// src/components/ProductsEditor.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Product {
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

const CATEGORIES = ["tea", "food", "combo", "bulk"];

export default function ProductsEditor() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Partial<Product>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(p: Product) {
    setEditingId(p.id);
    setDraft({ ...p });
    setMessage("");
  }

  function cancelEdit() {
    setEditingId(null);
    setDraft({});
  }

  async function save() {
    if (!editingId) return;
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch(`/api/admin/products/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name,
          price: draft.price,
          category: draft.category,
          description: draft.description,
          weight: draft.weight,
          in_stock: draft.in_stock,
          featured: draft.featured,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }

      setMessage("✓ Saved");
      setEditingId(null);
      setDraft({});
      await load();
      setTimeout(() => setMessage(""), 2000);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleSoftDelete(p: Product) {
    if (
      !confirm(
        `Hide "${p.name}" from the storefront?\n\nYou can restore it anytime.`
      )
    )
      return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      setMessage("✓ Hidden from storefront");
      await load();
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setMessage("Could not hide product");
    } finally {
      setSaving(false);
    }
  }

  async function handleRestore(p: Product) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ in_stock: true }),
      });
      if (!res.ok) throw new Error("Failed");
      setMessage("✓ Restored");
      await load();
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setMessage("Could not restore product");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p: Product) {
    const confirmed = confirm(
      `⚠️ PERMANENTLY delete "${p.name}"?\n\nThis removes the product AND its images. Cannot be undone.\n\nTip: use "Hide" instead if you might bring it back.`
    );
    if (!confirmed) return;

    const doubleConfirm = confirm(
      `Are you absolutely sure? This cannot be reversed.`
    );
    if (!doubleConfirm) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${p.id}?mode=hard`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed");
      setMessage("✓ Product deleted permanently");
      await load();
      setTimeout(() => setMessage(""), 2500);
    } catch {
      setMessage("Could not delete product");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-brand-600">Loading products…</div>
    );
  }

  return (
    <>
      {message && (
        <div
          className={`mb-4 text-sm rounded-xl px-3 py-2 ${
            message.startsWith("✓")
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      <ul className="space-y-3">
        {products.map((p) => {
          const isEditing = editingId === p.id;

          return (
            <li
              key={p.id}
              className={`bg-white border rounded-2xl p-3 ${
                p.in_stock
                  ? "border-brand-100"
                  : "border-yellow-200 bg-yellow-50/30"
              }`}
            >
              <div className="flex gap-3">
                <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-brand-50">
                  <Image
                    src={p.thumb}
                    alt={p.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                  {!p.in_stock && (
                    <div className="absolute inset-0 bg-ink/50 flex items-center justify-center">
                      <span className="text-[9px] text-white font-bold tracking-wide">
                        HIDDEN
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {!isEditing ? (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="font-medium text-ink text-sm leading-tight">
                            {p.name}
                          </div>
                          <div className="text-xs text-brand-500 mt-0.5">
                            {p.category}
                            {p.weight && ` · ${p.weight}`}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-bold text-brand-700 text-sm">
                            ₦{p.price.toLocaleString("en-NG")}
                          </div>
                          <div className="text-[10px] text-brand-500">
                            {p.in_stock ? "In stock" : "Hidden"}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <button
                          onClick={() => startEdit(p)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-500 text-white active:bg-brand-600"
                        >
                          Edit
                        </button>
                        {p.in_stock ? (
                          <button
                            onClick={() => handleSoftDelete(p)}
                            disabled={saving}
                            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-800 border border-yellow-200 active:bg-yellow-100 disabled:opacity-50"
                          >
                            Hide
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRestore(p)}
                            disabled={saving}
                            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-green-50 text-green-800 border border-green-200 active:bg-green-100 disabled:opacity-50"
                          >
                            Restore
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(p)}
                          disabled={saving}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-red-50 text-red-700 border border-red-200 active:bg-red-100 disabled:opacity-50"
                        >
                          Delete
                        </button>
                        {p.featured && (
                          <span className="text-[10px] px-2 py-1 rounded-full bg-brand-100 text-brand-700 self-center">
                            Featured
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={draft.name ?? ""}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, name: e.target.value }))
                        }
                        placeholder="Name"
                        className="w-full px-2 py-1.5 text-sm rounded-lg border border-brand-200 focus:outline-none focus:border-brand-500"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={draft.price ?? 0}
                          onChange={(e) =>
                            setDraft((d) => ({
                              ...d,
                              price: parseInt(e.target.value) || 0,
                            }))
                          }
                          placeholder="Price"
                          className="w-full px-2 py-1.5 text-sm rounded-lg border border-brand-200 focus:outline-none focus:border-brand-500"
                        />
                        <select
                          value={draft.category ?? "tea"}
                          onChange={(e) =>
                            setDraft((d) => ({
                              ...d,
                              category: e.target.value,
                            }))
                          }
                          className="w-full px-2 py-1.5 text-sm rounded-lg border border-brand-200 focus:outline-none focus:border-brand-500 bg-white"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <input
                        type="text"
                        value={draft.weight ?? ""}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, weight: e.target.value }))
                        }
                        placeholder="Weight/size (optional)"
                        className="w-full px-2 py-1.5 text-sm rounded-lg border border-brand-200 focus:outline-none focus:border-brand-500"
                      />

                      <textarea
                        value={draft.description ?? ""}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Description"
                        rows={2}
                        className="w-full px-2 py-1.5 text-sm rounded-lg border border-brand-200 focus:outline-none focus:border-brand-500 resize-none"
                      />

                      <div className="flex gap-3 text-xs">
                        <label className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={draft.in_stock ?? false}
                            onChange={(e) =>
                              setDraft((d) => ({
                                ...d,
                                in_stock: e.target.checked,
                              }))
                            }
                          />
                          In stock
                        </label>
                        <label className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={draft.featured ?? false}
                            onChange={(e) =>
                              setDraft((d) => ({
                                ...d,
                                featured: e.target.checked,
                              }))
                            }
                          />
                          Featured
                        </label>
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={save}
                          disabled={saving}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-green-600 text-white active:bg-green-700 disabled:opacity-50"
                        >
                          {saving ? "Saving…" : "Save"}
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={saving}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 active:bg-brand-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}