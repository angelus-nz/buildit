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
  PLANNING: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
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
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Projects</h1>
        <Link
          href="/dashboard/projects/new"
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
        >
          + New project
        </Link>
      </div>

      {projects.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="mb-4 text-sm text-slate-400">No projects yet.</p>
          <Link
            href="/dashboard/projects/new"
            className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400"
          >
            Create your first project →
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <h2 className="truncate text-sm font-medium text-slate-900 dark:text-white">
                  {project.title}
                </h2>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[project.status]}`}
                >
                  {STATUS_LABELS[project.status]}
                </span>
                {!project.isPublic && (
                  <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-400 dark:border-slate-600">
                    Private
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {project._count.updates} update{project._count.updates !== 1 ? "s" : ""}
                {project.updates[0] && (
                  <> · Last update {new Date(project.updates[0].createdAt).toLocaleDateString()}</>
                )}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/dashboard/projects/${project.id}/updates/new`}
                className="text-xs font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400"
              >
                Add update
              </Link>
              <span className="text-slate-200 dark:text-slate-600">|</span>
              <Link
                href={`/tradesmen/${business.slug}/projects/${project.id}`}
                className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
                target="_blank"
              >
                View public ↗
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
