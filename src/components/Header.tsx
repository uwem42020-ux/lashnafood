// src/components/Header.tsx

import Link from "next/link";
import Image from "next/image";
import CartButton from "./CartButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur border-b border-brand-100">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/images/logo-thumb.webp"
            alt="Lashna Foods"
            width={40}
            height={40}
            className="rounded-full"
            style={{ width: "auto", height: "auto" }}
            priority
          />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link
            href="/admin/login"
            className="px-3 py-1.5 rounded-full border border-brand-200 text-brand-700 text-sm font-medium active:bg-brand-50"
          >
            Login
          </Link>
          <CartButton />
        </div>
      </div>
    </header>
  );
}