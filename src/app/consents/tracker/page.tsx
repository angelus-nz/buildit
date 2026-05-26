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
  DRAFT: { label: "Draft", className: "bg-gray-100 text-gray-600" },
  SUBMITTED: { label: "Submitted", className: "bg-blue-100 text-blue-700" },
  PROCESSING: { label: "Processing", className: "bg-yellow-100 text-yellow-700" },
  APPROVED: { label: "Approved", className: "bg-green-100 text-green-700" },
  DECLINED: { label: "Declined", className: "bg-red-100 text-red-700" },
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-gray-900">
            BuildIt
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/consents" className="text-gray-600 hover:text-gray-900">
              Consent types
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link href="/consents" className="hover:underline">Council Consents</Link>
          <span>/</span>
          <span>My Applications</span>
        </div>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">My Consent Applications</h1>
            <p className="text-gray-500 text-sm">
              Track your council consent applications and correspondence.
            </p>
          </div>
          <Link
            href="/consents/tracker/new"
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
          >
            + New application
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-sm mb-4">No consent applications yet.</p>
            <Link
              href="/consents/tracker/new"
              className="text-sm text-blue-600 font-medium hover:underline"
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
                  className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{app.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {councilMap[app.councilId] ?? app.councilId} ·{" "}
                        {consentTypeMap[app.consentTypeId] ?? app.consentTypeId}
                      </p>
                      {app.siteAddress && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{app.siteAddress}</p>
                      )}
                      {app.referenceNumber && (
                        <p className="text-xs text-gray-500 mt-0.5">
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
