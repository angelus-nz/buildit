import { auth } from "@/lib/auth";
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
    <div className="mx-auto max-w-2xl px-6 py-8">
      {onboarded && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400">
          Profile created! Add a photo and publish it to go live.
        </div>
      )}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit profile</h1>
        <a
          href={`/tradesmen/${business.slug}`}
          className="text-sm font-medium text-amber-600 transition-colors hover:text-amber-700 dark:text-amber-400"
          target="_blank"
          rel="noopener noreferrer"
        >
          View public profile →
        </a>
      </div>
      <ProfileEditForm business={business} />
    </div>
  );
}
