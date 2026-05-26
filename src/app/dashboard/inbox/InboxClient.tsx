"use client";

import { useState } from "react";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  reply: string | null;
  status: "PENDING" | "READ" | "REPLIED";
  createdAt: string;
}

interface Props {
  initialInquiries: Inquiry[];
}

const STATUS_BADGE: Record<Inquiry["status"], string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  READ: "bg-gray-50 text-gray-600 border-gray-200",
  REPLIED: "bg-green-50 text-green-700 border-green-200",
};

export function InboxClient({ initialInquiries }: Props) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [reply, setReply] = useState("");
  const [replying, setReplying] = useState(false);
  const [replyError, setReplyError] = useState("");

  async function openInquiry(inq: Inquiry) {
    setSelected(inq);
    setReply(inq.reply ?? "");
    setReplyError("");

    if (inq.status === "PENDING") {
      const res = await fetch(`/api/inquiries/${inq.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "read" }),
      });
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) => (i.id === inq.id ? { ...i, status: "READ" } : i)),
        );
        setSelected((prev) => (prev?.id === inq.id ? { ...prev, status: "READ" } : prev));
      }
    }
  }

  async function submitReply() {
    if (!selected || !reply.trim()) return;
    setReplying(true);
    setReplyError("");

    const res = await fetch(`/api/inquiries/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reply", reply: reply.trim() }),
    });

    setReplying(false);

    if (!res.ok) {
      setReplyError("Failed to save reply. Please try again.");
      return;
    }

    const updated: Inquiry = await res.json();
    setInquiries((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    setSelected(updated);
  }

  if (inquiries.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm">
        No inquiries yet. When customers contact you, they&apos;ll appear here.
      </div>
    );
  }

  return (
    <div className="flex gap-6 min-h-[500px]">
      {/* Sidebar list */}
      <div className="w-72 flex-shrink-0 space-y-2">
        {inquiries.map((inq) => (
          <button
            key={inq.id}
            onClick={() => openInquiry(inq)}
            className={`w-full text-left rounded-xl border p-4 transition-all hover:border-blue-300 ${
              selected?.id === inq.id
                ? "border-blue-400 bg-blue-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-gray-900 truncate flex-1">{inq.name}</p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_BADGE[inq.status]}`}
              >
                {inq.status === "PENDING" ? "New" : inq.status === "READ" ? "Read" : "Replied"}
              </span>
            </div>
            <p className="text-xs text-gray-500 truncate mt-0.5">{inq.subject}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(inq.createdAt).toLocaleDateString()}
            </p>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {selected ? (
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div>
            <div className="flex items-center justify-between gap-4 mb-1">
              <h2 className="text-base font-semibold text-gray-900">{selected.subject}</h2>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_BADGE[selected.status]}`}
              >
                {selected.status === "PENDING" ? "New" : selected.status === "READ" ? "Read" : "Replied"}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              From: <span className="font-medium text-gray-700">{selected.name}</span>{" "}
              &lt;{selected.email}&gt; &middot;{" "}
              {new Date(selected.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg border border-gray-100 p-4">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{selected.message}</p>
          </div>

          {selected.reply && (
            <div className="bg-blue-50 rounded-lg border border-blue-100 p-4">
              <p className="text-xs font-medium text-blue-700 mb-1">Your reply</p>
              <p className="text-sm text-blue-900 whitespace-pre-wrap">{selected.reply}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {selected.reply ? "Update reply" : "Reply"}
            </label>
            <textarea
              rows={4}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Type your reply here..."
            />
            {replyError && (
              <p className="text-sm text-red-600">{replyError}</p>
            )}
            <button
              onClick={submitReply}
              disabled={replying || !reply.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-5 rounded-lg text-sm transition-colors"
            >
              {replying ? "Saving…" : "Send reply"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 text-sm">
          Select an inquiry to view
        </div>
      )}
    </div>
  );
}
