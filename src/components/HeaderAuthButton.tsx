// src/components/HeaderAuthButton.tsx

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeaderAuthButton() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/status")
      .then((r) => r.json())
      .then((d) => {
        if (active) setIsAdmin(!!d.admin);
      })
      .catch(() => {
        if (active) setIsAdmin(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Hide until we know (avoids flashing the wrong label)
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