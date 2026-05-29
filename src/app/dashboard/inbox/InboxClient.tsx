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
  PENDING: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
  READ: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600",
  REPLIED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
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
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center text-slate-400 dark:text-slate-500 text-sm">
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
            className={`w-full text-left rounded-xl border p-4 transition-all hover:border-amber-400 dark:hover:border-amber-600 ${
              selected?.id === inq.id
                ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-600"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate flex-1">{inq.name}</p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_BADGE[inq.status]}`}
              >
                {inq.status === "PENDING" ? "New" : inq.status === "READ" ? "Read" : "Replied"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{inq.subject}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              {new Date(inq.createdAt).toLocaleDateString()}
            </p>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {selected ? (
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-5 shadow-sm">
          <div>
            <div className="flex items-center justify-between gap-4 mb-1">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-50">{selected.subject}</h2>
              <span
                className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_BADGE[selected.status]}`}
              >
                {selected.status === "PENDING" ? "New" : selected.status === "READ" ? "Read" : "Replied"}
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              From: <span className="font-medium text-slate-700 dark:text-slate-300">{selected.name}</span>{" "}
              &lt;{selected.email}&gt; &middot;{" "}
              {new Date(selected.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-100 dark:border-slate-600 p-4">
            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{selected.message}</p>
          </div>

          {selected.reply && (
            <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-100 dark:border-amber-900 p-4">
              <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">Your reply</p>
              <p className="text-sm text-amber-900 dark:text-amber-200 whitespace-pre-wrap">{selected.reply}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              {selected.reply ? "Update reply" : "Reply"}
            </label>
            <textarea
              rows={4}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              placeholder="Type your reply here..."
            />
            {replyError && (
              <p className="text-sm text-red-600 dark:text-red-400">{replyError}</p>
            )}
            <button
              onClick={submitReply}
              disabled={replying || !reply.trim()}
              className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-semibold py-2 px-5 rounded-lg text-sm transition-colors"
            >
              {replying ? "Saving…" : "Send reply"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
          Select an inquiry to view
        </div>
      )}
    </div>
  );
}
