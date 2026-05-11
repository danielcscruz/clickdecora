import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import type { Purchase } from "@/types";

interface AdminPurchase extends Purchase {
  user_name: string;
  user_email: string;
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const token = (session as any)?.accessToken as string;

  let purchases: AdminPurchase[] = [];
  try {
    purchases = await apiFetch<AdminPurchase[]>("/admin/purchases", { token });
  } catch {}

  return <AdminDashboard purchases={purchases} token={token} />;
}
