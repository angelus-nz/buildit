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
  DRAFT: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-600",
  SENT: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
  OVERDUE: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
  CANCELLED: "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-600",
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-semibold text-slate-900 dark:text-slate-50 hover:opacity-80">
          BuildIt
        </Link>
        <Link href="/dashboard" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
          ← Dashboard
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">Invoices</h1>
          <Link href="/dashboard/quotes" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
            Manage quotes →
          </Link>
        </div>

        {invoices.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm">
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-4">No invoices yet.</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Invoices are created by converting an accepted quote.{" "}
              <Link href="/dashboard/quotes" className="text-amber-600 dark:text-amber-400 hover:underline">
                Go to quotes →
              </Link>
            </p>
          </div>
        )}

        <div className="space-y-3">
          {invoices.map((invoice) => {
            const customer = invoice.quote?.customer;
            return (
              <div key={invoice.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-medium text-slate-900 dark:text-slate-50 text-sm truncate">{invoice.title}</h2>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border shrink-0 ${STATUS_COLORS[invoice.status]}`}
                      >
                        {STATUS_LABELS[invoice.status]}
                      </span>
                    </div>
                    {customer && (
                      <p className="text-xs text-slate-500 dark:text-slate-400">{customer.name ?? customer.email}</p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      ${(invoice.amountCents / 100).toFixed(2)} {invoice.currency}
                      {invoice.dueAt && <> · Due {new Date(invoice.dueAt).toLocaleDateString()}</>}
                    </p>
                    {invoice.paidAt && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
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
