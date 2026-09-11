// src/app/admin/products/page.tsx

import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import LogoutButton from "@/components/LogoutButton";
import ProductsEditor from "@/components/ProductsEditor";
import NewProductForm from "@/components/NewProductForm";

export default async function ProductsPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) redirect("/admin/login");

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-ink">Products</h1>
          <p className="text-sm text-brand-600">
            Edit prices, stock and details
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
          className="bg-brand-500 text-white text-sm font-medium rounded-xl py-2.5 text-center"
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
          className="bg-white border border-brand-200 text-brand-700 text-sm font-medium rounded-xl py-2.5 text-center"
        >
          QR Codes
        </Link>
      </div>

      <NewProductForm />
      <ProductsEditor />
    </main>
  );
}