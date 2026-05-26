import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { InboxClient } from "./InboxClient";

export default async function InboxPage() {
  const session = await auth();

  if (!session) redirect("/auth/signin");
  if (session.user.role !== "TRADESMAN") redirect("/dashboard");

  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!business) redirect("/profile/onboard");

  const inquiries = await prisma.inquiry.findMany({
    where: { businessId: business.id },
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      email: true,
      subject: true,
      message: true,
      reply: true,
      status: true,
      createdAt: true,
    },
  });

  const serialised = inquiries.map((inq) => ({
    ...inq,
    createdAt: inq.createdAt.toISOString(),
  }));

  const pendingCount = inquiries.filter((i) => i.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-lg font-semibold text-gray-900 hover:opacity-80">
            BuildIt
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm text-gray-600">Inbox</span>
        </div>
        {pendingCount > 0 && (
          <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full">
            {pendingCount} new
          </span>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <InboxClient initialInquiries={serialised} />
      </main>
    </div>
  );
}
