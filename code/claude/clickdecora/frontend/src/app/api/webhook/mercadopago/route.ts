import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

/**
 * Proxy Mercado Pago webhooks to the FastAPI backend.
 * The actual HMAC validation happens in the backend.
 */
export async function POST(req: NextRequest) {
  const raw = await req.arrayBuffer();
  const xSignature = req.headers.get("x-signature") ?? "";

  const res = await fetch(`${BACKEND_URL}/webhook/mercadopago`, {
    method: "POST",
    body: raw,
    headers: {
      "Content-Type": "application/json",
      "x-signature": xSignature,
    },
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
