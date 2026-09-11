// src/lib/admin-auth.ts
// Real admin auth — checks Supabase session + whitelist

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Returns the authenticated admin's email if they're a valid admin,
 * or null if they're not logged in / not whitelisted.
 */
export async function getAdminEmail(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  // Verify email is in admin_users whitelist
  const adminDb = createAdminClient();
  const { data: admin } = await adminDb
    .from("admin_users")
    .select("email")
    .eq("email", user.email)
    .maybeSingle();

  if (!admin) return null;

  return user.email;
}

/**
 * Boolean shortcut for pages that just need a yes/no.
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const email = await getAdminEmail();
  return email !== null;
}