"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  businessId: string;
  businessName: string;
  isLoggedIn: boolean;
  isTradesman: boolean;
}

export function StartConversationButton({ businessId, businessName, isLoggedIn, isTradesman }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [firstMessage, setFirstMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (isTradesman) return null;

  if (!isLoggedIn) {
    return (
      <a
        href="/auth/signin"
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors"
      >
        Message {businessName}
      </a>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject.trim() || !firstMessage.trim()) return;
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessId, subject: subject.trim(), firstMessage: firstMessage.trim() }),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError("Failed to start conversation. Please try again.");
      return;
    }

    const { id } = await res.json();
    router.push(`/messages/${id}`);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors"
      >
        Message {businessName}
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
      <p className="text-sm font-semibold text-gray-900">Start a conversation with {businessName}</p>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Subject / job type</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          maxLength={200}
          required
          placeholder="e.g. Kitchen renovation quote"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Message</label>
        <textarea
          rows={3}
          value={firstMessage}
          onChange={(e) => setFirstMessage(e.target.value)}
          maxLength={2000}
          required
          placeholder="Describe what you need help with…"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting || !subject.trim() || !firstMessage.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
        >
          {submitting ? "Sending…" : "Send message"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-lg text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
