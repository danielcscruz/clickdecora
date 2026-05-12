import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import type { Purchase } from "@/types";
import { DashboardClient } from "@/components/client/DashboardClient";

async function getPurchases(token: string): Promise<Purchase[]> {
  try {
    return await apiFetch<Purchase[]>("/purchases/", { token });
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const token = (session as any)?.accessToken as string;
  const purchases = await getPurchases(token);

  return (
    <DashboardClient
      purchases={purchases}
      userName={session?.user?.name ?? ""}
    />
  );
}
