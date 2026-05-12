import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import type { Message, Purchase } from "@/types";
import { ChatClient } from "@/components/client/ChatClient";

async function getPurchase(protocol: string, token: string): Promise<Purchase | null> {
  try {
    return await apiFetch<Purchase>(`/purchases/${protocol}`, { token });
  } catch {
    return null;
  }
}

async function getMessages(protocol: string, token: string): Promise<Message[]> {
  try {
    return await apiFetch<Message[]>(`/messages/${protocol}`, { token });
  } catch {
    return [];
  }
}

export default async function ChatPage({ params }: { params: { protocolo: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const token = (session as any)?.accessToken as string;
  const userId = Number((session.user as any)?.id ?? 0);

  const [purchase, initialMessages] = await Promise.all([
    getPurchase(params.protocolo, token),
    getMessages(params.protocolo, token),
  ]);

  if (!purchase) redirect("/dashboard");

  const backendWsUrl = (process.env.BACKEND_URL ?? "http://localhost:8000")
    .replace("http://", "ws://")
    .replace("https://", "wss://");

  return (
    <ChatClient
      protocol={params.protocolo}
      initialMessages={initialMessages}
      token={token}
      userId={userId}
      userName={session.user?.name ?? ""}
      wsBaseUrl={backendWsUrl}
    />
  );
}
