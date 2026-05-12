import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiFetch } from "@/lib/api";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ detail: "Não autenticado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const token = (session as any).accessToken as string;

    const data = await apiFetch<{ checkout_url: string; protocol: string }>(
      "/purchases/checkout",
      {
        method: "POST",
        body: JSON.stringify(body),
        token,
      }
    );

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { detail: error.message ?? "Erro ao criar checkout" },
      { status: 400 }
    );
  }
}
