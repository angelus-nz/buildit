import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

function MetricCard({
  label,
  value,
  href,
  accentClass,
}: {
  label: string;
  value: number;
  href: string;
  accentClass: string;
}) {
  return (
    <Link
      href={href}
      className="group flex cursor-pointer flex-col gap-1 rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-amber-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-amber-600"
    >
      <span className={`text-3xl font-bold ${accentClass}`}>{value}</span>
      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</span>
    </Link>
  );
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-amber-400 hover:text-amber-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-amber-500 dark:hover:text-amber-400"
    >
      {label}
    </Link>
  );
}

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        published
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${published ? "bg-emerald-500" : "bg-amber-500"}`} />
      {published ? "Published" : "Draft"}
    </span>
  );
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const isTradesman = session.user.role === "TRADESMAN";
  const firstName = session.user.name?.split(" ")[0] ?? "there";

  const business = isTradesman
    ? await prisma.business.findUnique({
        where: { userId: session.user.id },
        select: { slug: true, name: true, isPublished: true, id: true },
      })
    : null;

  if (isTradesman && !business) redirect("/profile/onboard");

  const [pendingInquiries, activeQuotes, unpaidInvoices] = await Promise.all([
    business
      ? prisma.inquiry.count({ where: { businessId: business.id, status: "PENDING" } })
      : Promise.resolve(0),
    business
      ? prisma.quote.count({
          where: { businessId: business.id, status: { in: ["DRAFT", "SENT", "ACCEPTED"] } },
        })
      : Promise.resolve(0),
    business
      ? prisma.invoice.count({
          where: { businessId: business.id, status: { in: ["DRAFT", "SENT", "OVERDUE"] } },
        })
      : Promise.resolve(0),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Welcome back, {firstName}
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {isTradesman && business
            ? `Here's what's happening with ${business.name} today.`
            : "Here's your BuildIt overview."}
        </p>
      </div>

      {isTradesman && business && (
        <>
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <MetricCard
              label="Active quotes"
              value={activeQuotes}
              href="/dashboard/quotes"
              accentClass="text-amber-600 dark:text-amber-400"
            />
            <MetricCard
              label="Unpaid invoices"
              value={unpaidInvoices}
              href="/dashboard/invoices"
              accentClass="text-orange-600 dark:text-orange-400"
            />
            <MetricCard
              label="New inquiries"
              value={pendingInquiries}
              href="/dashboard/inbox"
              accentClass="text-blue-600 dark:text-blue-400"
            />
          </div>

          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Quick actions
            </p>
            <div className="flex flex-wrap gap-2">
              <QuickAction href="/dashboard/quotes/new" label="+ New quote" />
              <QuickAction href="/dashboard/projects/new" label="+ New project" />
              <QuickAction href="/consents/tracker/new" label="+ New consent" />
              {business.isPublished && (
                <QuickAction href={`/tradesmen/${business.slug}`} label="View public profile" />
              )}
            </div>
          </div>

          <section className="mb-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Your business
            </p>
            <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">{business.name}</h2>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                    buildit.angelus.nz/tradesmen/{business.slug}
                  </p>
                </div>
                <StatusBadge published={business.isPublished} />
              </div>
              <div className="mt-4 flex gap-3">
                <Link
                  href="/profile/edit"
                  className="cursor-pointer text-sm font-medium text-amber-600 transition-colors hover:text-amber-700 dark:text-amber-400"
                >
                  Edit profile
                </Link>
                {business.isPublished && (
                  <Link
                    href={`/tradesmen/${business.slug}`}
                    className="cursor-pointer text-sm text-slate-500 transition-colors hover:text-slate-900 dark:hover:text-white"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View public page &rarr;
                  </Link>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      <section className="mb-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Council consents
        </p>
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">NZ Council applications</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Navigate Nelson and Tasman council consent processes — fees, required documents, and application tracking.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/consents/tracker/new"
              className="cursor-pointer rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
            >
              Fill out a form
            </Link>
            <Link
              href="/consents/tracker"
              className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:border-amber-400 hover:text-amber-700 dark:border-slate-600 dark:text-slate-400"
            >
              My applications
            </Link>
            <Link
              href="/consents/templates/my"
              className="cursor-pointer rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:border-amber-400 hover:text-amber-700 dark:border-slate-600 dark:text-slate-400"
            >
              My templates
            </Link>
          </div>
        </div>
      </section>

      {!isTradesman && (
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Find a tradesman
          </p>
          <div className="rounded-xl border border-slate-200 bg-white p-5 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="text-slate-600 dark:text-slate-400">
              Browse our directory to find skilled tradesmen near you.
            </p>
            <Link
              href="/find"
              className="mt-4 inline-block cursor-pointer rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
            >
              Browse tradesmen
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
