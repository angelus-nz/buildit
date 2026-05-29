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
  PLANNING: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800",
  IN_PROGRESS: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800",
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
        <a href="/dashboard" className="text-lg font-semibold text-slate-900 dark:text-slate-50 hover:opacity-80">
          BuildIt
        </a>
        <a href="/dashboard" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
          ← Dashboard
        </a>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">Projects</h1>
          <Link
            href="/dashboard/projects/new"
            className="bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            + New project
          </Link>
        </div>

        {projects.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center shadow-sm">
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-4">No projects yet.</p>
            <Link
              href="/dashboard/projects/new"
              className="text-amber-600 dark:text-amber-400 text-sm font-medium hover:underline"
            >
              Create your first project →
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-start justify-between gap-4 shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="font-medium text-slate-900 dark:text-slate-50 text-sm truncate">{project.title}</h2>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border ${STATUS_COLORS[project.status]}`}
                  >
                    {STATUS_LABELS[project.status]}
                  </span>
                  {!project.isPublic && (
                    <span className="text-xs text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-600 px-2 py-0.5 rounded-full">
                      Private
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  {project._count.updates} update{project._count.updates !== 1 ? "s" : ""}
                  {project.updates[0] && (
                    <> · Last update {new Date(project.updates[0].createdAt).toLocaleDateString()}</>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/dashboard/projects/${project.id}/updates/new`}
                  className="text-xs text-amber-600 dark:text-amber-400 font-medium hover:underline"
                >
                  Add update
                </Link>
                <span className="text-slate-200 dark:text-slate-600">|</span>
                <Link
                  href={`/tradesmen/${business.slug}/projects/${project.id}`}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
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
