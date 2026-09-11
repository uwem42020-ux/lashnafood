// src/app/admin/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <main className="max-w-sm mx-auto px-4 py-12">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🔐</div>
        <h1 className="text-xl font-bold text-ink">Admin Login</h1>
        <p className="text-sm text-brand-600 mt-1">Lashna Foods Dashboard</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-brand-100 rounded-2xl p-5 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2.5 rounded-xl border border-brand-200 bg-white focus:outline-none focus:border-brand-500"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full px-3 py-2.5 rounded-xl border border-brand-200 bg-white focus:outline-none focus:border-brand-500"
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-3 py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold active:bg-brand-700 disabled:bg-brand-300"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </main>
  );
}