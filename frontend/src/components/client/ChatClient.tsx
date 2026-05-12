"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, ArrowLeft, Loader2, Paperclip } from "lucide-react";
import Link from "next/link";
import type { Message } from "@/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  protocol: string;
  initialMessages: Message[];
  token: string;
  userId: number;
  userName: string;
  wsBaseUrl: string;
}

export function ChatClient({ protocol, initialMessages, token, userId, userName, wsBaseUrl }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const ws = new WebSocket(`${wsBaseUrl}/ws/chat/${protocol}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);
    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data) as Message;
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      } catch {}
    };

    return () => ws.close();
  }, [protocol, token, wsBaseUrl]);

  function sendMessage() {
    if (!input.trim() || !connected || sending) return;
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;

    setSending(true);
    ws.send(JSON.stringify({ content: input.trim() }));
    setInput("");
    setSending(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-56px-64px)]">
      {/* Header */}
      <div className="bg-surface border border-gold/20 rounded-t-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-dark/40 hover:text-dark transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="font-body font-semibold text-primary tracking-wide text-sm">
              {protocol}
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  connected ? "bg-emerald-500" : "bg-amber-400"
                )}
              />
              <span className="font-body text-xs text-dark/40">
                {connected ? "Conectado" : "Reconectando..."}
              </span>
            </div>
          </div>
        </div>
        <Link href={`/agendamento/${protocol}`} className="btn-outline text-xs py-1.5 px-4">
          Agendar reunião
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-surface border-x border-gold/20 px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <p className="font-body text-sm text-dark/40">
              Nenhuma mensagem ainda. Comece a conversa!
            </p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isMine = msg.sender_id === userId;
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn("flex", isMine ? "justify-end" : "justify-start")}
            >
              <div className={cn("max-w-[75%]", isMine ? "items-end" : "items-start")}>
                {!isMine && (
                  <div className="font-body text-xs text-dark/40 mb-1 ml-1">
                    {msg.sender_name}
                  </div>
                )}
                <div
                  className={cn(
                    "px-4 py-2.5 rounded-sm font-body text-sm leading-relaxed",
                    isMine
                      ? "bg-primary text-cream rounded-br-none"
                      : "bg-surface-alt border border-gold/20 text-dark rounded-bl-none"
                  )}
                >
                  {msg.content}
                  {msg.file_url && (
                    <a
                      href={msg.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2 text-xs underline opacity-70"
                    >
                      Anexo
                    </a>
                  )}
                </div>
                <div className="font-body text-xs text-dark/30 mt-1 px-1">
                  {new Date(msg.created_at).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-surface border border-t-0 border-gold/20 rounded-b-sm px-4 py-3 flex gap-3 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escreva sua mensagem..."
          rows={1}
          className="flex-1 input-field resize-none min-h-[44px] max-h-32 overflow-y-auto py-2.5"
          style={{ height: "auto" }}
          onInput={(e) => {
            const t = e.currentTarget;
            t.style.height = "auto";
            t.style.height = `${t.scrollHeight}px`;
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || !connected || sending}
          className="btn-primary py-2.5 px-4 shrink-0"
        >
          {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  );
}
