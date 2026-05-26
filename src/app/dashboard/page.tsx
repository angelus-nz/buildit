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
        select: { slug: true, name: true, isPublished: true },
      })
    : null;

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
          </div>
        )}

        {!isTradesman && (
          <p className="text-gray-500 mt-2">
            Your dashboard is being built. Check back soon.
          </p>
        )}
      </main>
    </div>
  );
}
