// src/app/api/qr/[id]/route.ts

import QRCode from "qrcode";
import { getProduct } from "@/lib/products-server";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: Params) {
  const { id } = await params;

  const product = await getProduct(id);
  if (!product) {
    return new Response("Product not found", { status: 404 });
  }

  const url = new URL(req.url);
  const base = `${url.protocol}//${url.host}`;
  const target = `${base}/p/${product.id}`;

  const { searchParams } = url;
  const size = Math.min(
    Math.max(parseInt(searchParams.get("size") || "512", 10), 128),
    2048
  );

  try {
    const png = await QRCode.toBuffer(target, {
      type: "png",
      width: size,
      margin: 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#5a2c18",
        light: "#fdfaf5",
      },
    });

    return new Response(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("QR generation failed:", err);
    return new Response("QR generation failed", { status: 500 });
  }
}