// src/app/api/admin/upload/route.ts

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import sharp from "sharp";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const productId = (formData.get("productId") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    if (!productId) {
      return NextResponse.json(
        { error: "productId required" },
        { status: 400 }
      );
    }

    if (!/^image\/(png|jpeg|jpg|webp)$/i.test(file.type)) {
      return NextResponse.json(
        { error: "Only PNG, JPG, or WebP allowed" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fullBuffer = await sharp(buffer)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toBuffer();

    const thumbBuffer = await sharp(buffer)
      .resize({ width: 400, withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer();

    const supabase = createAdminClient();

    // Add timestamp so each upload gets a unique URL
    // This fixes cache collision when re-uploading after delete
    const stamp = Date.now();
    const fullPath = `${productId}-${stamp}.webp`;
    const thumbPath = `${productId}-${stamp}-thumb.webp`;

    const { error: fullErr } = await supabase.storage
      .from("product-images")
      .upload(fullPath, fullBuffer, {
        contentType: "image/webp",
        upsert: false,
      });

    if (fullErr) throw new Error(fullErr.message);

    const { error: thumbErr } = await supabase.storage
      .from("product-images")
      .upload(thumbPath, thumbBuffer, {
        contentType: "image/webp",
        upsert: false,
      });

    if (thumbErr) throw new Error(thumbErr.message);

    const { data: fullUrl } = supabase.storage
      .from("product-images")
      .getPublicUrl(fullPath);

    const { data: thumbUrl } = supabase.storage
      .from("product-images")
      .getPublicUrl(thumbPath);

    return NextResponse.json({
      image: fullUrl.publicUrl,
      thumb: thumbUrl.publicUrl,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}