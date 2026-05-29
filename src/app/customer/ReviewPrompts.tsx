"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PendingInvoice {
  id: string;
  title: string;
  amountCents: number;
  currency: string;
  paidAt: string | null;
  business: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    category: string;
  };
}

function StarPicker({
  value,
  onChange,
}: {
  readonly value: number;
  readonly onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-xl leading-none focus:outline-none"
          aria-label={`${star} star`}
        >
          <span className={(hovered || value) >= star ? "text-amber-400" : "text-slate-300"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

function ReviewForm({
  invoice,
  onDismiss,
}: {
  readonly invoice: PendingInvoice;
  readonly onDismiss: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: invoice.business.id,
          invoiceId: invoice.id,
          rating,
          body: body.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to submit review");
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="flex items-center gap-2 py-2 text-sm text-emerald-700 dark:text-emerald-400">
        <span>✓</span>
        <span>Review submitted — thank you!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-3">
      <StarPicker value={rating} onChange={setRating} />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={2}
        maxLength={2000}
        placeholder="Share your experience (optional)"
        className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-amber-500 hover:bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50 transition-colors"
        >
          {submitting ? "Submitting…" : "Submit review"}
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-lg px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          Skip
        </button>
      </div>
    </form>
  );
}

export default function ReviewPrompts() {
  const [invoices, setInvoices] = useState<PendingInvoice[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/customer/invoices/pending-review")
      .then((r) => r.json())
      .then((data: unknown) => {
        if (Array.isArray(data)) setInvoices(data as PendingInvoice[]);
      })
      .catch(() => null);
  }, []);

  const visible = invoices.filter((inv) => !dismissed.has(inv.id));
  if (visible.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wide">
        Leave a Review
      </h2>
      <div className="space-y-3">
        {visible.map((invoice) => (
          <Card
            key={invoice.id}
            className="border border-amber-200 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20"
          >
            <CardHeader className="pb-1">
              <CardTitle className="text-sm font-semibold flex items-center justify-between gap-2">
                <span>
                  How was{" "}
                  <Link
                    href={`/tradesmen/${invoice.business.slug}`}
                    className="text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    {invoice.business.name}
                  </Link>
                  ?
                </span>
                <span className="text-xs font-normal text-slate-400">
                  {invoice.title}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {expanded === invoice.id ? (
                <ReviewForm
                  invoice={invoice}
                  onDismiss={() => setDismissed((prev) => new Set([...prev, invoice.id]))}
                />
              ) : (
                <button
                  onClick={() => setExpanded(invoice.id)}
                  className="text-sm text-amber-600 dark:text-amber-400 hover:underline font-medium"
                >
                  Rate this job →
                </button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
