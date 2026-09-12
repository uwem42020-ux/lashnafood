// src/components/HeaderAuthButton.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeaderAuthButton() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  async function check() {
    try {
      const res = await fetch("/api/admin/status", { cache: "no-store" });
      const d = await res.json();
      setIsAdmin(!!d.admin);
    } catch {
      setIsAdmin(false);
    }
  }

  useEffect(() => {
    check();

    const onAuthChange = () => check();
    window.addEventListener("lashna-auth-change", onAuthChange);

    const onVisibility = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("lashna-auth-change", onAuthChange);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  if (isAdmin === null) {
    return (
      <div className="w-[68px] h-[30px] rounded-full bg-brand-100/60 animate-pulse" />
    );
  }

  return (
    <Link
      href={isAdmin ? "/admin" : "/admin/login"}
      className="px-3 py-1.5 rounded-full border border-brand-200 text-brand-700 text-sm font-medium active:scale-95 active:bg-brand-50 transition-transform"
    >
      {isAdmin ? "Dashboard" : "Login"}
    </Link>
  );
}