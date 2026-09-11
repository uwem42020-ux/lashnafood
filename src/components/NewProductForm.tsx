// src/components/NewProductForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["tea", "food", "combo", "bulk"];

export default function NewProductForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("tea");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState("");
  const [inStock, setInStock] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function reset() {
    setName("");
    setPrice("");
    setCategory("tea");
    setDescription("");
    setWeight("");
    setInStock(true);
    setFeatured(false);
    setFile(null);
    setPreview(null);
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Name is required");
    if (!price || parseInt(price) <= 0) return setError("Valid price required");
    if (!file) return setError("Please select an image");

    setSubmitting(true);

    try {
      // 1. Generate product id from name
      const productId = name
        .toLowerCase()
        .trim()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      // 2. Upload image
      const formData = new FormData();
      formData.append("file", file);
      formData.append("productId", productId);

      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const data = await uploadRes.json().catch(() => ({}));
        throw new Error(data.error || "Image upload failed");
      }

      const { image, thumb } = await uploadRes.json();

      // 3. Create product
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: productId,
          name: name.trim(),
          price: parseInt(price),
          category,
          description: description.trim() || null,
          image,
          thumb,
          weight: weight.trim() || null,
          in_stock: inStock,
          featured,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not create product");
      }

      reset();
      setOpen(false);
      router.refresh();
      // Force reload of products list on the page
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full mb-4 py-3 rounded-xl bg-brand-600 text-white font-semibold active:bg-brand-700"
      >
        + Add New Product
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-brand-100 rounded-2xl p-4 mb-4 space-y-3"
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-bold text-ink">New Product</h3>
        <button
          type="button"
          onClick={() => {
            reset();
            setOpen(false);
          }}
          className="text-xs text-brand-500 font-medium"
        >
          Cancel
        </button>
      </div>

      {/* Image preview / upload */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          Product image
        </label>
        {preview ? (
          <div className="flex items-start gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 rounded-lg object-cover border border-brand-200"
            />
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreview(null);
              }}
              className="text-xs text-accent-500 font-medium"
            >
              Change
            </button>
          </div>
        ) : (
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="w-full text-sm text-brand-700 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-brand-500 file:text-white file:font-medium file:text-sm"
          />
        )}
        <p className="text-xs text-brand-500 mt-1">
          PNG, JPG, or WebP. Max 10MB. Image will be compressed automatically.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          Product name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Arabian Tea 2 Liters"
          className="w-full px-3 py-2 rounded-xl border border-brand-200 bg-white focus:outline-none focus:border-brand-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Price (₦)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="2500"
            className="w-full px-3 py-2 rounded-xl border border-brand-200 bg-white focus:outline-none focus:border-brand-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-brand-200 bg-white focus:outline-none focus:border-brand-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          Weight / size <span className="text-brand-400">(optional)</span>
        </label>
        <input
          type="text"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="e.g. 1L, 500g"
          className="w-full px-3 py-2 rounded-xl border border-brand-200 bg-white focus:outline-none focus:border-brand-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description (1-2 sentences)"
          rows={2}
          className="w-full px-3 py-2 rounded-xl border border-brand-200 bg-white focus:outline-none focus:border-brand-500 resize-none"
        />
      </div>

      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          In stock
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          Featured
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold active:bg-brand-700 disabled:bg-brand-300"
      >
        {submitting ? "Creating…" : "Create Product"}
      </button>
    </form>
  );
}