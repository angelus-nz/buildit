"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Invoice {
  id: string;
  status: string;
}

export function InvoiceActions({ invoice }: { invoice: Invoice }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function doAction(action: string) {
    setLoading(true);
    try {
      await fetch(`/api/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2 shrink-0">
      {invoice.status === "DRAFT" && (
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
            onClick={() => doAction("cancel")}
            disabled={loading}
            className="text-xs text-red-500 hover:underline disabled:opacity-50"
          >
            Cancel
          </button>
        </>
      )}
      {(invoice.status === "SENT" || invoice.status === "OVERDUE") && (
        <>
          <button
            onClick={() => doAction("mark_paid")}
            disabled={loading}
            className="text-xs text-green-600 font-medium hover:underline disabled:opacity-50"
          >
            Mark paid
          </button>
          <span className="text-gray-200">|</span>
          <button
            onClick={() => doAction("cancel")}
            disabled={loading}
            className="text-xs text-red-500 hover:underline disabled:opacity-50"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
}
