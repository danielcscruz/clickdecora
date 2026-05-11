import { Suspense } from "react";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { ClientNav } from "@/components/client/ClientNav";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    const headersList = headers();
    const pathname = headersList.get("x-invoke-path") ?? "/dashboard";
    redirect(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
  }

  return (
    <div className="min-h-screen bg-surface-alt">
      <ClientNav session={session} />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Suspense fallback={null}>{children}</Suspense>
      </main>
    </div>
  );
}
