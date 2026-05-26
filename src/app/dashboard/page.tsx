import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const isTradesman = session.user.role === "TRADESMAN";
  const business = isTradesman
    ? await prisma.business.findUnique({
        where: { userId: session.user.id },
        select: { slug: true, name: true, isPublished: true, id: true },
      })
    : null;

  const pendingInquiries =
    business
      ? await prisma.inquiry.count({ where: { businessId: business.id, status: "PENDING" } })
      : 0;

  if (isTradesman && !business) {
    redirect("/profile/onboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">BuildIt</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {session.user.name ?? session.user.email}
          </span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
            {session.user.role}
          </span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit" className="text-sm text-gray-500 hover:text-gray-700">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome, {session.user.name?.split(" ")[0] ?? "there"}!
        </h2>

        {isTradesman && business && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Your profile</h3>
              <p className="text-gray-900 font-medium">{business.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                {business.isPublished ? "✅ Published — visible to customers" : "⚠️ Draft — not yet visible"}
              </p>
              <div className="flex gap-3 mt-4">
                <Link
                  href="/profile/edit"
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  Edit profile
                </Link>
                {business.isPublished && (
                  <Link
                    href={`/tradesmen/${business.slug}`}
                    className="text-sm text-gray-500 hover:underline"
                    target="_blank"
                  >
                    View public page
                  </Link>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Projects</h3>
              <p className="text-xs text-gray-500 mt-1">
                Showcase your work in progress and completed jobs.
              </p>
              <div className="flex gap-3 mt-4">
                <Link
                  href="/dashboard/projects"
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  Manage projects
                </Link>
                <Link href="/dashboard/projects/new" className="text-sm text-gray-500 hover:underline">
                  + New project
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-700">Inbox</h3>
                {pendingInquiries > 0 && (
                  <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                    {pendingInquiries} new
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                View and reply to customer inquiries.
              </p>
              <div className="mt-4">
                <Link
                  href="/dashboard/inbox"
                  className="text-sm text-blue-600 font-medium hover:underline"
                >
                  Open inbox
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Council consents — available to all users */}
        <div className={isTradesman ? "mt-4" : "mt-6"}>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Council consents</h3>
            <p className="text-xs text-gray-500 mt-1">
              Navigate NZ council consent processes in Nelson and Tasman. Find fees, required documents, and track applications to approval.
            </p>
            <div className="flex gap-3 mt-4">
              <Link
                href="/consents"
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                Consent types &amp; contacts
              </Link>
              <Link href="/consents/tracker" className="text-sm text-gray-500 hover:underline">
                My applications
              </Link>
            </div>
          </div>
        </div>

        {!isTradesman && (
          <p className="text-gray-500 mt-4 text-sm">
            More features coming soon.
          </p>
        )}
      </main>
    </div>
  );
}
