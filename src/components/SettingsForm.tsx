// src/components/SettingsForm.tsx

"use client";

import { useEffect, useState } from "react";

const FIELDS = [
  { key: "bank_name", label: "Bank name", placeholder: "e.g. GTBank" },
  {
    key: "bank_account_number",
    label: "Account number",
    placeholder: "10 digits",
  },
  {
    key: "bank_account_name",
    label: "Account name",
    placeholder: "Business name on account",
  },
  {
    key: "whatsapp_number",
    label: "WhatsApp number",
    placeholder: "234XXXXXXXXXX (no + or spaces)",
  },
  {
    key: "confirmation_window",
    label: "Payment confirmation window",
    placeholder: "e.g. 30 minutes",
  },
];

export default function SettingsForm() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();
        setValues(data.settings || {});
      } catch (err) {
        setError("Could not load settings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError("Could not save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12 text-brand-600">Loading…</div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-brand-100 rounded-2xl p-5 space-y-4"
    >
      {FIELDS.map((f) => (
        <div key={f.key}>
          <label className="block text-sm font-medium text-ink mb-1">
            {f.label}
          </label>
          <input
            type="text"
            value={values[f.key] ?? ""}
            onChange={(e) =>
              setValues((v) => ({ ...v, [f.key]: e.target.value }))
            }
            placeholder={f.placeholder}
            className="w-full px-3 py-2.5 rounded-xl border border-brand-200 bg-white focus:outline-none focus:border-brand-500"
          />
        </div>
      ))}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-3 py-2">
          ✓ Saved
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="w-full py-3 rounded-xl bg-brand-600 text-white font-semibold active:bg-brand-700 disabled:bg-brand-300"
      >
        {saving ? "Saving…" : "Save Settings"}
      </button>
    </form>
  );
}