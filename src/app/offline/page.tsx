// src/app/offline/page.tsx

import Link from "next/link";

export const metadata = {
  title: "Offline — Lashna Foods",
};

export default function OfflinePage() {
  return (
    <main className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">📡</div>

      <h1 className="text-2xl font-bold text-ink mb-2">
        You&apos;re offline
      </h1>

      <p className="text-brand-600 mb-8">
        No internet connection right now. But you can still reach us — or
        browse pages you&apos;ve visited before.
      </p>

      <div className="space-y-3">
        <a
          href="https://wa.me/2348036772195?text=Hi%20Lashna%20Foods%2C%20I%27d%20like%20to%20place%20an%20order"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3.5 rounded-xl bg-green-600 text-white font-semibold"
        >
          💬 Order via WhatsApp
        </a>

        <Link
          href="/"
          className="block w-full py-3.5 rounded-xl border-2 border-brand-300 text-brand-700 font-semibold"
        >
          Try Homepage Again
        </Link>
      </div>

      <p className="text-xs text-brand-500 mt-8">
        Tip: pages you&apos;ve already visited are still available offline.
      </p>
    </main>
  );
}