"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface MessageData {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: { id: string; name: string | null; image: string | null };
}

interface Props {
  conversationId: string;
  currentUserId: string;
  subject: string;
  otherName: string;
  initialMessages: MessageData[];
}

export function ConversationClient({
  conversationId,
  currentUserId,
  subject,
  otherName,
  initialMessages,
}: Props) {
  const [messages, setMessages] = useState<MessageData[]>(initialMessages);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const markRead = useCallback(() => {
    fetch(`/api/conversations/${conversationId}/read`, { method: "POST" }).catch(() => null);
  }, [conversationId]);

  const pollMessages = useCallback(async () => {
    const res = await fetch(`/api/conversations/${conversationId}`).catch(() => null);
    if (!res?.ok) return;
    const data = await res.json();
    setMessages(data.conversation.messages ?? []);
  }, [conversationId]);

  useEffect(() => {
    markRead();
    const interval = setInterval(pollMessages, 3000);
    return () => clearInterval(interval);
  }, [markRead, pollMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
      Notification.requestPermission().catch(() => null);
    }
  }, []);

  const prevCountRef = useRef(initialMessages.length);
  useEffect(() => {
    const prev = prevCountRef.current;
    prevCountRef.current = messages.length;
    if (messages.length <= prev) return;

    const newMsgs = messages.slice(prev);
    const fromOther = newMsgs.filter((m) => m.senderId !== currentUserId);
    if (fromOther.length === 0 || document.hasFocus()) return;
    if (Notification.permission !== "granted") return;

    const last = fromOther[fromOther.length - 1];
    new Notification(`${last.sender.name ?? "New message"} — ${subject}`, {
      body: last.content.slice(0, 100),
    });
  }, [messages, currentUserId, subject]);

  async function handleSend() {
    const trimmed = content.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setError("");

    const res = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: trimmed }),
    });

    setSending(false);

    if (!res.ok) {
      setError("Failed to send. Please try again.");
      return;
    }

    const { message } = await res.json();
    setMessages((prev) => [...prev, message]);
    setContent("");
    textareaRef.current?.focus();
    markRead();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 bg-white">
        <div>
          <p className="text-sm font-semibold text-gray-900">{subject}</p>
          <p className="text-xs text-gray-500">{otherName}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400 py-10">No messages yet.</p>
        )}
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                isMe
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm"
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-xs mt-1 ${isMe ? "text-blue-200" : "text-gray-400"}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-200 bg-white px-4 py-3">
        {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            rows={1}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
            className="flex-1 border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <button
            onClick={handleSend}
            disabled={sending || !content.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition-colors flex-shrink-0"
          >
            {sending ? "…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
