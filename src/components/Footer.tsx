// src/components/Footer.tsx

import Link from "next/link";
import Image from "next/image";
import { BUSINESS, whatsappLink } from "@/lib/config";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-900 text-brand-100 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Image
              src="/images/logo-thumb.webp"
              alt="Lashna Foods"
              width={36}
              height={36}
              className="rounded-full bg-cream p-0.5"
              style={{ width: "auto", height: "auto" }}
            />
            <span className="font-bold text-white text-lg">
              Lashna Foods
            </span>
          </div>
          <p className="text-sm text-brand-200/90 leading-relaxed">
            Fresh teas &amp; foods, delivered across Nigeria. Scan, tap,
            order — in under 60 seconds.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-white text-sm mb-3 uppercase tracking-wide">
            Shop
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-white">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/category/tea" className="hover:text-white">
                Teas
              </Link>
            </li>
            <li>
              <Link href="/category/combo" className="hover:text-white">
                Combos &amp; Packs
              </Link>
            </li>
            <li>
              <Link href="/category/bulk" className="hover:text-white">
                Bulk Sizes
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-white text-sm mb-3 uppercase tracking-wide">
            Contact
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href={whatsappLink("Hi Lashna Foods!")}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center gap-2"
              >
                <span>💬</span> WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`tel:${BUSINESS.phone}`}
                className="hover:text-white flex items-center gap-2"
              >
                <span>📞</span> {BUSINESS.whatsappDisplay}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="hover:text-white flex items-center gap-2"
              >
                <span>✉️</span> {BUSINESS.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t border-brand-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-brand-300">
          <div>
            © {year} Lashna Foods. A Betame company.
          </div>
          <div className="flex items-center gap-3">
            <span>{BUSINESS.domain}</span>
            <span>·</span>
            <span>Made in Nigeria 🇳🇬</span>
          </div>
        </div>
      </div>
    </footer>
  );
}