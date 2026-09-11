// src/app/api/admin/settings/route.ts

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.from("settings").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const settings = Object.fromEntries(
    (data ?? []).map((row) => [row.key, row.value])
  );

  return NextResponse.json({ settings });
}

export async function PATCH(req: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const supabase = createAdminClient();

  const updates = Object.entries(body).map(([key, value]) => ({
    key,
    value: String(value),
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("settings")
    .upsert(updates, { onConflict: "key" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}