import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import type { Message } from "@/types";
import { ChatClient } from "@/components/client/ChatClient";
import { redirect } from "next/navigation";

export default async function AdminChatPage({ params }: { params: { protocolo: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") redirect("/admin");

  const token = (session as any)?.accessToken as string;
  const userId = Number((session.user as any)?.id ?? 0);

  let initialMessages: Message[] = [];
  try {
    initialMessages = await apiFetch<Message[]>(`/messages/${params.protocolo}`, { token });
  } catch {}

  const backendWsUrl = (process.env.BACKEND_URL ?? "http://localhost:8000")
    .replace("http://", "ws://")
    .replace("https://", "wss://");

  return (
    <ChatClient
      protocol={params.protocolo}
      initialMessages={initialMessages}
      token={token}
      userId={userId}
      userName={session.user?.name ?? "Admin"}
      wsBaseUrl={backendWsUrl}
    />
  );
}
