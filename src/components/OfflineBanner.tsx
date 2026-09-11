// src/components/OfflineBanner.tsx

"use client";

import { useEffect, useState } from "react";

export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    function update() {
      setOffline(!navigator.onLine);
    }
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-ink text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg">
      📡 You are offline
    </div>
  );
}