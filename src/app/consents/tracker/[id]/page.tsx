import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import councilsData from "@/data/councils.json";
import ConsentApplicationDetail from "./ConsentApplicationDetail";

export const metadata: Metadata = { title: "Consent Application — BuildIt" };

const councilMap = Object.fromEntries(councilsData.councils.map((c) => [c.id, c]));
const consentTypeMap = Object.fromEntries(
  councilsData.councils.flatMap((c) => c.consentTypes.map((t) => [t.id, t])),
);

export default async function ConsentApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) {
    redirect("/auth/signin?callbackUrl=/consents/tracker");
  }

  const { id } = await params;

  const application = await prisma.consentApplication.findUnique({
    where: { id, userId: session.user.id },
    include: { correspondenceLogs: { orderBy: { date: "desc" } } },
  });

  if (!application) notFound();

  const council = councilMap[application.councilId];
  const consentType = consentTypeMap[application.consentTypeId];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-gray-900">BuildIt</Link>
          <Link href="/consents/tracker" className="text-sm text-gray-600 hover:text-gray-900">
            My Applications
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/consents" className="hover:underline">Council Consents</Link>
          <span>/</span>
          <Link href="/consents/tracker" className="hover:underline">My Applications</Link>
          <span>/</span>
          <span className="truncate max-w-[200px]">{application.title}</span>
        </div>

        <ConsentApplicationDetail
          application={{
            ...application,
            submittedAt: application.submittedAt?.toISOString() ?? null,
            decidedAt: application.decidedAt?.toISOString() ?? null,
            createdAt: application.createdAt.toISOString(),
            updatedAt: application.updatedAt.toISOString(),
            correspondenceLogs: application.correspondenceLogs.map((log) => ({
              ...log,
              date: log.date.toISOString(),
              createdAt: log.createdAt.toISOString(),
            })),
          }}
          councilName={council?.name ?? application.councilId}
          councilConsentPage={council?.consentPage}
          consentTypeName={consentType?.name ?? application.consentTypeId}
          consentTypeTemplateId={consentType?.templateId}
        />
      </main>
    </div>
  );
}
