// src/app/api/admin/login/route.ts

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_ATTEMPTS = 5;         // failures allowed
const WINDOW_MINUTES = 15;      // rolling window

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const h = await headers();
    const ip =
      h.get("x-forwarded-for")?.split(",")[0].trim() ||
      h.get("x-real-ip") ||
      "unknown";

    const adminDb = createAdminClient();

    // ---- 1. Check recent failed attempts ----
    const windowStart = new Date(
      Date.now() - WINDOW_MINUTES * 60 * 1000
    ).toISOString();

    const { data: recent } = await adminDb
      .from("login_attempts")
      .select("attempted_at, success")
      .eq("email", normalizedEmail)
      .gte("attempted_at", windowStart)
      .order("attempted_at", { ascending: false });

    const recentFailures = (recent ?? []).filter((r) => !r.success).length;

    if (recentFailures >= MAX_ATTEMPTS) {
      const oldestFailure = recent
        ?.filter((r) => !r.success)
        .pop()?.attempted_at;

      const unlockAt = oldestFailure
        ? new Date(
            new Date(oldestFailure).getTime() + WINDOW_MINUTES * 60 * 1000
          )
        : new Date(Date.now() + WINDOW_MINUTES * 60 * 1000);

      const minutesLeft = Math.max(
        1,
        Math.ceil((unlockAt.getTime() - Date.now()) / 60000)
      );

      return NextResponse.json(
        {
          error: `Too many attempts. Try again in ${minutesLeft} minute${
            minutesLeft === 1 ? "" : "s"
          }.`,
          locked: true,
        },
        { status: 429 }
      );
    }

    // ---- 2. Check email is whitelisted ----
    const { data: admin } = await adminDb
      .from("admin_users")
      .select("email")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (!admin) {
      await adminDb.from("login_attempts").insert({
        email: normalizedEmail,
        ip,
        success: false,
      });

      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ---- 3. Attempt Supabase sign-in ----
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error || !data.user) {
      await adminDb.from("login_attempts").insert({
        email: normalizedEmail,
        ip,
        success: false,
      });

      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ---- 4. Success — record it, clear past failures ----
    await adminDb.from("login_attempts").insert({
      email: normalizedEmail,
      ip,
      success: true,
    });

    // Clear past failures for this email so next login starts fresh
    await adminDb
      .from("login_attempts")
      .delete()
      .eq("email", normalizedEmail)
      .eq("success", false);

    // Clean up very old records (best effort — errors ignored)
    try {
      await adminDb.rpc("cleanup_login_attempts");
    } catch {
      // Optional — safe to ignore
    }

    return NextResponse.json({ ok: true, email: data.user.email });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}