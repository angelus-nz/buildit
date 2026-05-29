import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QuoteActions } from "./QuoteActions";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
  EXPIRED: "Expired",
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600",
  SENT: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  DECLINED: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  EXPIRED: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
};

export default async function QuotesPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "TRADESMAN") redirect("/auth/signin");

  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!business) redirect("/profile/onboard");

  const quotes = await prisma.quote.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      invoice: { select: { id: true, status: true } },
    },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Quotes</h1>
        <Link
          href="/dashboard/quotes/new"
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
        >
          + New quote
        </Link>
      </div>

      {quotes.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="mb-4 text-sm text-slate-400">No quotes yet.</p>
          <Link
            href="/dashboard/quotes/new"
            className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400"
          >
            Create your first quote →
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {quotes.map((quote) => (
          <div
            key={quote.id}
            className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h2 className="truncate text-sm font-medium text-slate-900 dark:text-white">
                    {quote.title}
                  </h2>
                  <span
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[quote.status]}`}
                  >
                    {STATUS_LABELS[quote.status]}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {quote.customer.name ?? quote.customer.email} ·{" "}
                  ${(quote.amountCents / 100).toFixed(2)} {quote.currency}
                </p>
                {quote.expiresAt && (
                  <p className="mt-0.5 text-xs text-slate-400">
                    Expires {new Date(quote.expiresAt).toLocaleDateString()}
                  </p>
                )}
                {quote.invoice && (
                  <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">
                    Invoice created ·{" "}
                    <Link href="/dashboard/invoices" className="underline">
                      View invoice
                    </Link>
                  </p>
                )}
              </div>
              <QuoteActions quote={quote} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
