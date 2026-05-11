import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiFetch } from "@/lib/api";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { protocol: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return NextResponse.json({ detail: "Acesso negado" }, { status: 403 });
  }

  const token = (session as any).accessToken as string;
  const { status } = await req.json();

  try {
    const data = await apiFetch(`/admin/purchases/${params.protocol}/status?status=${status}`, {
      method: "PATCH",
      token,
    });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ detail: e.message }, { status: 400 });
  }
}
