import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import councilsData from "@/data/councils.json";

export const metadata: Metadata = {
  title: "My Consent Applications — BuildIt",
};

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "Draft", className: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400" },
  SUBMITTED: { label: "Submitted", className: "bg-slate-200 text-slate-700 dark:bg-slate-600 dark:text-slate-300" },
  PROCESSING: { label: "Processing", className: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" },
  APPROVED: { label: "Approved", className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" },
  DECLINED: { label: "Declined", className: "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400" },
};

const councilMap = Object.fromEntries(councilsData.councils.map((c) => [c.id, c.shortName]));
const consentTypeMap = Object.fromEntries(
  councilsData.councils.flatMap((c) => c.consentTypes.map((t) => [t.id, t.name])),
);

export default async function TrackerPage() {
  const session = await auth();
  if (!session) {
    redirect("/auth/signin?callbackUrl=/consents/tracker");
  }

  const applications = await prisma.consentApplication.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-slate-900 dark:text-slate-50">
            BuildIt
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/consents" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50">
              Consent types
            </Link>
            <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/consents" className="hover:underline">Council Consents</Link>
          <span>/</span>
          <span>My Applications</span>
        </div>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1">My Consent Applications</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Track your council consent applications and correspondence.
            </p>
          </div>
          <Link
            href="/consents/tracker/new"
            className="bg-amber-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-amber-600 transition whitespace-nowrap"
          >
            + New application
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">No consent applications yet.</p>
            <Link
              href="/consents/tracker/new"
              className="text-sm text-amber-600 dark:text-amber-400 font-medium hover:underline"
            >
              Create your first application record →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => {
              const statusStyle = STATUS_STYLES[app.status] ?? STATUS_STYLES.DRAFT;
              return (
                <Link
                  key={app.id}
                  href={`/consents/tracker/${app.id}`}
                  className="block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-medium text-slate-900 dark:text-slate-50 truncate">{app.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {councilMap[app.councilId] ?? app.councilId} ·{" "}
                        {consentTypeMap[app.consentTypeId] ?? app.consentTypeId}
                      </p>
                      {app.siteAddress && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">{app.siteAddress}</p>
                      )}
                      {app.referenceNumber && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Ref: <span className="font-mono">{app.referenceNumber}</span>
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${statusStyle.className}`}
                    >
                      {statusStyle.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
