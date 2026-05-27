"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewQuotePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const form = new FormData(e.currentTarget);
    const amountStr = form.get("amount") as string;
    const amountCents = Math.round(parseFloat(amountStr) * 100);

    const expiresAt = form.get("expiresAt") as string;

    const payload = {
      customerEmail: form.get("customerEmail") as string,
      title: form.get("title") as string,
      description: (form.get("description") as string) || undefined,
      amountCents,
      currency: "NZD",
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
    };

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong");
        return;
      }

      router.push("/dashboard/quotes");
      router.refresh();
    } catch {
      setError("Network error — please try again");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-semibold text-gray-900 hover:opacity-80">
          BuildIt
        </Link>
        <Link href="/dashboard/quotes" className="text-sm text-gray-500 hover:text-gray-700">
          ← Quotes
        </Link>
      </header>

      <main className="max-w-lg mx-auto px-4 py-10">
        <h1 className="text-xl font-bold text-gray-900 mb-6">New quote</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="customerEmail">
              Customer email *
            </label>
            <input
              id="customerEmail"
              name="customerEmail"
              type="email"
              required
              placeholder="customer@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">Must be a registered BuildIt account.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="title">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              maxLength={200}
              placeholder="Kitchen renovation quote"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              maxLength={2000}
              placeholder="Scope of work, materials, terms…"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="amount">
              Amount (NZD) *
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              required
              min="0.01"
              step="0.01"
              placeholder="1500.00"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="expiresAt">
              Expiry date
            </label>
            <input
              id="expiresAt"
              name="expiresAt"
              type="date"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving…" : "Create quote"}
            </button>
            <Link
              href="/dashboard/quotes"
              className="flex-1 text-center border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
