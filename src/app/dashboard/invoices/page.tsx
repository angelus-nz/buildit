import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InvoiceActions } from "./InvoiceActions";

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  PAID: "Paid",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-50 text-gray-600 border-gray-200",
  SENT: "bg-blue-50 text-blue-700 border-blue-200",
  PAID: "bg-green-50 text-green-700 border-green-200",
  OVERDUE: "bg-red-50 text-red-600 border-red-200",
  CANCELLED: "bg-gray-50 text-gray-400 border-gray-200",
};

export default async function InvoicesPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "TRADESMAN") redirect("/auth/signin");

  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!business) redirect("/profile/onboard");

  const invoices = await prisma.invoice.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    include: {
      quote: {
        select: { id: true, customer: { select: { name: true, email: true } } },
      },
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
          <h1 className="text-xl font-bold text-gray-900">Invoices</h1>
          <Link href="/dashboard/quotes" className="text-sm text-gray-500 hover:text-gray-700">
            Manage quotes →
          </Link>
        </div>

        {invoices.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-400 text-sm mb-4">No invoices yet.</p>
            <p className="text-xs text-gray-400">
              Invoices are created by converting an accepted quote.{" "}
              <Link href="/dashboard/quotes" className="text-blue-600 hover:underline">
                Go to quotes →
              </Link>
            </p>
          </div>
        )}

        <div className="space-y-3">
          {invoices.map((invoice) => {
            const customer = invoice.quote?.customer;
            return (
              <div key={invoice.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-medium text-gray-900 text-sm truncate">{invoice.title}</h2>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border shrink-0 ${STATUS_COLORS[invoice.status]}`}
                      >
                        {STATUS_LABELS[invoice.status]}
                      </span>
                    </div>
                    {customer && (
                      <p className="text-xs text-gray-500">{customer.name ?? customer.email}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      ${(invoice.amountCents / 100).toFixed(2)} {invoice.currency}
                      {invoice.dueAt && <> · Due {new Date(invoice.dueAt).toLocaleDateString()}</>}
                    </p>
                    {invoice.paidAt && (
                      <p className="text-xs text-green-600 mt-0.5">
                        Paid {new Date(invoice.paidAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <InvoiceActions invoice={invoice} />
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
