// src/app/api/admin/login/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const adminDb = createAdminClient();
    const { data: admin } = await adminDb
      .from("admin_users")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (!admin) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: true, email: data.user.email });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}