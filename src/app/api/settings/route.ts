// src/app/api/settings/route.ts

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("settings")
    .select("key, value");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const settings = Object.fromEntries(
    (data ?? []).map((row) => [row.key, row.value])
  );

  return NextResponse.json({ settings });
}