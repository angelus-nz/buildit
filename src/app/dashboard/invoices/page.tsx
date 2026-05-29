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
  DRAFT: "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-400 dark:border-slate-600",
  SENT: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  OVERDUE: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  CANCELLED: "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-700 dark:text-slate-500 dark:border-slate-600",
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
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Invoices</h1>
        <Link
          href="/dashboard/quotes"
          className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
        >
          Manage quotes →
        </Link>
      </div>

      {invoices.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="mb-2 text-sm text-slate-400">No invoices yet.</p>
          <p className="text-xs text-slate-400">
            Invoices are created by converting an accepted quote.{" "}
            <Link
              href="/dashboard/quotes"
              className="font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400"
            >
              Go to quotes →
            </Link>
          </p>
        </div>
      )}

      <div className="space-y-3">
        {invoices.map((invoice) => {
          const customer = invoice.quote?.customer;
          return (
            <div
              key={invoice.id}
              className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h2 className="truncate text-sm font-medium text-slate-900 dark:text-white">
                      {invoice.title}
                    </h2>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[invoice.status]}`}
                    >
                      {STATUS_LABELS[invoice.status]}
                    </span>
                  </div>
                  {customer && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {customer.name ?? customer.email}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ${(invoice.amountCents / 100).toFixed(2)} {invoice.currency}
                    {invoice.dueAt && <> · Due {new Date(invoice.dueAt).toLocaleDateString()}</>}
                  </p>
                  {invoice.paidAt && (
                    <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">
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
    </div>
  );
}
