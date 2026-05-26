import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STATUS_LABELS: Record<string, string> = {
  PLANNING: "Planning",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const STATUS_COLORS: Record<string, string> = {
  PLANNING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
};

export default async function DashboardProjectsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const business = await prisma.business.findUnique({
    where: { userId: session.user.id },
    select: { id: true, slug: true },
  });
  if (!business) redirect("/profile/onboard");

  const projects = await prisma.project.findMany({
    where: { businessId: business.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { updates: true } },
      updates: { orderBy: { createdAt: "desc" }, take: 1, select: { createdAt: true } },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <a href="/dashboard" className="text-lg font-semibold text-gray-900 hover:opacity-80">
          BuildIt
        </a>
        <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
          ← Dashboard
        </a>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Projects</h1>
          <Link
            href="/dashboard/projects/new"
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + New project
          </Link>
        </div>

        {projects.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-400 text-sm mb-4">No projects yet.</p>
            <Link
              href="/dashboard/projects/new"
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              Create your first project →
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-medium text-gray-900 text-sm truncate">{project.title}</h2>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_COLORS[project.status]}`}
                  >
                    {STATUS_LABELS[project.status]}
                  </span>
                  {!project.isPublic && (
                    <span className="text-xs text-gray-400 border border-gray-200 px-2 py-0.5 rounded-full">
                      Private
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  {project._count.updates} update{project._count.updates !== 1 ? "s" : ""}
                  {project.updates[0] && (
                    <> · Last update {new Date(project.updates[0].createdAt).toLocaleDateString()}</>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/dashboard/projects/${project.id}/updates/new`}
                  className="text-xs text-blue-600 font-medium hover:underline"
                >
                  Add update
                </Link>
                <span className="text-gray-200">|</span>
                <Link
                  href={`/tradesmen/${business.slug}/projects/${project.id}`}
                  className="text-xs text-gray-500 hover:text-gray-700"
                  target="_blank"
                >
                  View public ↗
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
