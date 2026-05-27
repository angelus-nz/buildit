import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SENT: "Sent — awaiting your response",
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

interface Params {
  params: Promise<{ id: string }>;
}

export default async function PublicQuotePage({ params }: Params) {
  const { id } = await params;

  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      business: { select: { name: true, slug: true, phone: true, city: true } },
      customer: { select: { name: true, email: true } },
    },
  });

  if (!quote) notFound();

  const statusLabel = STATUS_LABELS[quote.status] ?? quote.status;
  const statusColor = STATUS_COLORS[quote.status] ?? "bg-gray-50 text-gray-600 border-gray-200";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-gray-900 hover:opacity-80">
          BuildIt
        </Link>
      </header>

      <main className="max-w-lg mx-auto px-4 py-10">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Quote from</p>
              <h1 className="text-base font-bold text-gray-900">{quote.business.name}</h1>
              {quote.business.city && (
                <p className="text-xs text-gray-400">{quote.business.city}</p>
              )}
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${statusColor}`}>
              {statusLabel}
            </span>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">{quote.title}</h2>
            {quote.description && (
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{quote.description}</p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-gray-600">Total amount</span>
            <span className="text-lg font-bold text-gray-900">
              {new Intl.NumberFormat("en-NZ", { style: "currency", currency: quote.currency }).format(
                quote.amountCents / 100,
              )}
            </span>
          </div>

          {quote.expiresAt && (
            <p className="text-xs text-gray-400">
              Quote expires:{" "}
              {new Date(quote.expiresAt).toLocaleDateString("en-NZ", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}

          <div className="border-t border-gray-100 pt-4 text-xs text-gray-400 space-y-1">
            <p>Prepared for: {quote.customer.name ?? quote.customer.email}</p>
            {quote.business.phone && <p>Contact: {quote.business.phone}</p>}
            {quote.business.slug && (
              <p>
                <Link
                  href={`/tradesmen/${quote.business.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  View profile →
                </Link>
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
