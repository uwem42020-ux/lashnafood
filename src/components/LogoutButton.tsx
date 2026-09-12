// src/components/LogoutButton.tsx

"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });

    // Notify the header that auth state changed
    window.dispatchEvent(new Event("lashna-auth-change"));

    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="text-sm text-accent-500 font-medium px-3 py-1.5 rounded-full border border-accent-500/30 active:scale-95 active:bg-accent-500/10 transition-transform"
    >
      Logout
    </button>
  );
}