"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Quote {
  id: string;
  status: string;
  invoice: { id: string; status: string } | null;
}

export function QuoteActions({ quote }: { quote: Quote }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function doAction(action: string) {
    setLoading(true);
    try {
      await fetch(`/api/quotes/${quote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function deleteQuote() {
    if (!confirm("Delete this draft quote?")) return;
    setLoading(true);
    try {
      await fetch(`/api/quotes/${quote.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      {quote.status === "DRAFT" && (
        <>
          <button
            onClick={() => doAction("send")}
            disabled={loading}
            className="text-xs text-blue-600 font-medium hover:underline disabled:opacity-50"
          >
            Send
          </button>
          <span className="text-gray-200">|</span>
          <button
            onClick={deleteQuote}
            disabled={loading}
            className="text-xs text-red-500 hover:underline disabled:opacity-50"
          >
            Delete
          </button>
        </>
      )}
      {quote.status === "SENT" && (
        <>
          <button
            onClick={() => doAction("accept")}
            disabled={loading}
            className="text-xs text-green-600 font-medium hover:underline disabled:opacity-50"
          >
            Mark accepted
          </button>
          <span className="text-gray-200">|</span>
          <button
            onClick={() => doAction("decline")}
            disabled={loading}
            className="text-xs text-red-500 hover:underline disabled:opacity-50"
          >
            Decline
          </button>
        </>
      )}
      {quote.status === "ACCEPTED" && !quote.invoice && (
        <button
          onClick={() => doAction("convert_to_invoice")}
          disabled={loading}
          className="text-xs text-blue-600 font-medium hover:underline disabled:opacity-50"
        >
          Convert to invoice
        </button>
      )}
    </div>
  );
}
