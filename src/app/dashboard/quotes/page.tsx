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
  DRAFT: "bg-gray-50 text-gray-600 border-gray-200",
  SENT: "bg-blue-50 text-blue-700 border-blue-200",
  ACCEPTED: "bg-green-50 text-green-700 border-green-200",
  DECLINED: "bg-red-50 text-red-600 border-red-200",
  EXPIRED: "bg-yellow-50 text-yellow-700 border-yellow-200",
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-semibold text-gray-900 hover:opacity-80">
          BuildIt
        </Link>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
          ← Dashboard
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Quotes</h1>
          <Link
            href="/dashboard/quotes/new"
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New quote
          </Link>
        </div>

        {quotes.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-400 text-sm mb-4">No quotes yet.</p>
            <Link href="/dashboard/quotes/new" className="text-blue-600 text-sm font-medium hover:underline">
              Create your first quote →
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {quotes.map((quote) => (
            <div key={quote.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-medium text-gray-900 text-sm truncate">{quote.title}</h2>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full border shrink-0 ${STATUS_COLORS[quote.status]}`}
                    >
                      {STATUS_LABELS[quote.status]}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {quote.customer.name ?? quote.customer.email} ·{" "}
                    ${(quote.amountCents / 100).toFixed(2)} {quote.currency}
                  </p>
                  {quote.expiresAt && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Expires {new Date(quote.expiresAt).toLocaleDateString()}
                    </p>
                  )}
                  {quote.invoice && (
                    <p className="text-xs text-green-600 mt-0.5">
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
      </main>
    </div>
  );
}
