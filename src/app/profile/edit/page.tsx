import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProfileEditForm from "./ProfileEditForm";

export default async function ProfileEditPage({
  searchParams,
}: {
  searchParams: Promise<{ onboarded?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
  });

  if (!business) redirect("/profile/onboard");

  const { onboarded } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">BuildIt</h1>
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            Dashboard
          </a>
          <a
            href={`/tradesmen/${business.slug}`}
            className="text-sm text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View public profile
          </a>
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

      <main className="max-w-2xl mx-auto px-6 py-10">
        {onboarded && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-6">
            Profile created! Add a photo and publish it to go live.
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit profile</h2>
        <ProfileEditForm business={business} />
      </main>
    </div>
  );
}
