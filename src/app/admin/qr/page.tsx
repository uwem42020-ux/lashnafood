// src/app/admin/qr/page.tsx

import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getProducts } from "@/lib/products-server";
import LogoutButton from "@/components/LogoutButton";

export default async function QRPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  const products = await getProducts();

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-ink">QR Codes</h1>
          <p className="text-sm text-brand-600">
            Print these — each links to a product page
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        <Link
          href="/admin"
          className="bg-white border border-brand-200 text-brand-700 text-sm font-medium rounded-xl py-2.5 text-center"
        >
          Orders
        </Link>
        <Link
          href="/admin/products"
          className="bg-white border border-brand-200 text-brand-700 text-sm font-medium rounded-xl py-2.5 text-center"
        >
          Products
        </Link>
        <Link
          href="/admin/settings"
          className="bg-white border border-brand-200 text-brand-700 text-sm font-medium rounded-xl py-2.5 text-center"
        >
          Settings
        </Link>
        <Link
          href="/admin/qr"
          className="bg-brand-500 text-white text-sm font-medium rounded-xl py-2.5 text-center"
        >
          QR Codes
        </Link>
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {products.map((product) => (
          <li
            key={product.id}
            className="bg-white border border-brand-100 rounded-2xl p-3 flex flex-col items-center"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/qr/${product.id}?size=400`}
              alt={`QR for ${product.name}`}
              width={200}
              height={200}
              className="rounded-lg"
            />
            <div className="text-sm font-medium text-ink mt-2 text-center leading-tight">
              {product.name}
            </div>
            <div className="text-xs text-brand-600 mt-0.5">
              ₦{product.price.toLocaleString("en-NG")}
            </div>
            <div className="flex gap-2 mt-3 w-full">
              <a
                href={`/api/qr/${product.id}?size=1024`}
                download={`qr-${product.id}.png`}
                className="flex-1 text-xs font-semibold py-2 rounded-lg bg-brand-500 text-white text-center active:bg-brand-600"
              >
                Download
              </a>
              <a
                href={`/p/${product.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-xs font-semibold py-2 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 text-center active:bg-brand-100"
              >
                Test
              </a>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 p-4 bg-brand-50 border border-brand-100 rounded-2xl text-sm text-brand-700">
        <div className="font-semibold mb-1">💡 How to use</div>
        <ul className="list-disc pl-5 space-y-1 text-xs">
          <li>
            <strong>Download</strong> gives you a 1024×1024 PNG — print this
            on product bags.
          </li>
          <li>
            <strong>Test</strong> opens the product page in a new tab — same
            page a customer lands on after scanning.
          </li>
          <li>
            The QR points to the product&apos;s page URL. Once deployed to{" "}
            <strong>lashnafoods.com.ng</strong>, generated QRs will encode the
            live domain.
          </li>
        </ul>
      </div>
    </main>
  );
}