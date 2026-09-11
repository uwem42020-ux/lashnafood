// src/app/admin/login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (locked) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 429) {
          setLocked(true);
        }
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
            disabled={locked}
            className="w-full px-3 py-2.5 rounded-xl border border-brand-200 bg-white focus:outline-none focus:border-brand-500 disabled:bg-brand-50 disabled:text-brand-400"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={locked}
              className="w-full px-3 py-2.5 pr-11 rounded-xl border border-brand-200 bg-white focus:outline-none focus:border-brand-500 disabled:bg-brand-50 disabled:text-brand-400"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-brand-600 active:scale-90 transition-transform"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? (
                // Eye-off icon
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                // Eye icon
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div
            className={`text-sm rounded-xl px-3 py-2 ${
              locked
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || locked}
          className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold active:scale-95 active:bg-brand-700 disabled:bg-brand-300 disabled:cursor-not-allowed transition-transform inline-flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Spinner size={16} /> Signing in…
            </>
          ) : locked ? (
            "Locked — try again later"
          ) : (
            "Sign In"
          )}
        </button>

        {locked && (
          <p className="text-xs text-brand-500 text-center">
            Too many failed attempts. The lock clears automatically after
            15 minutes.
          </p>
        )}
      </form>
    </main>
  );
}