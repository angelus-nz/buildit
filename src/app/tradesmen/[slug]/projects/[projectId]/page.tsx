import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string; projectId: string }>;
}

const STATUS_LABELS: Record<string, string> = {
  PLANNING: "Planning",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

const STATUS_COLORS: Record<string, string> = {
  PLANNING: "bg-yellow-50 text-yellow-700",
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  COMPLETED: "bg-green-50 text-green-700",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, projectId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      isPublic: true,
      business: { slug, isPublished: true },
    },
    select: { title: true, description: true, business: { select: { name: true } } },
  });

  if (!project) return { title: "Not found" };

  return {
    title: `${project.title} — ${project.business.name} | BuildIt`,
    description: project.description?.slice(0, 160) ?? undefined,
  };
}

export default async function ProjectTimelinePage({ params }: Props) {
  const { slug, projectId } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      isPublic: true,
      business: { slug, isPublished: true },
    },
    include: {
      business: { select: { name: true, slug: true } },
      updates: {
        orderBy: { createdAt: "desc" },
        include: { photos: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  if (!project) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <a href="/" className="text-lg font-semibold text-gray-900 hover:opacity-80">
          BuildIt
        </a>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href={`/tradesmen/${project.business.slug}`} className="hover:text-gray-700">
            {project.business.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{project.title}</span>
        </nav>

        {/* Project header */}
        <section className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start gap-3 mb-3">
            <h1 className="text-xl font-bold text-gray-900 flex-1">{project.title}</h1>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${STATUS_COLORS[project.status]}`}
            >
              {STATUS_LABELS[project.status]}
            </span>
          </div>

          {project.description && (
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          )}

          <p className="text-xs text-gray-400 mt-4">
            {project.updates.length} update{project.updates.length !== 1 ? "s" : ""}
            {project.startedAt && (
              <> · Started {new Date(project.startedAt).toLocaleDateString()}</>
            )}
            {project.completedAt && (
              <> · Completed {new Date(project.completedAt).toLocaleDateString()}</>
            )}
          </p>
        </section>

        {/* Timeline */}
        {project.updates.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
            No updates posted yet. Check back soon.
          </div>
        ) : (
          <section>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Timeline
            </h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
              <div className="space-y-6">
                {project.updates.map((update) => (
                  <div key={update.id} className="flex gap-4 relative">
                    <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center shrink-0 z-10">
                      <span className="text-blue-600 text-xs">📷</span>
                    </div>

                    <div className="flex-1 pb-2">
                      <p className="text-xs text-gray-400 mb-2">
                        {new Date(update.createdAt).toLocaleDateString("en-NZ", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>

                      {update.photos.length > 0 && (
                        <div
                          className={`grid gap-2 mb-3 ${update.photos.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
                        >
                          {update.photos.map((photo) => (
                            <div
                              key={photo.id}
                              className="rounded-lg overflow-hidden border border-gray-100"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={photo.url}
                                alt={photo.caption ?? "Project photo"}
                                className="w-full h-48 object-cover"
                              />
                              {photo.caption && (
                                <p className="px-3 py-2 text-xs text-gray-500 bg-white">
                                  {photo.caption}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                          {update.body}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div className="text-center">
          <Link
            href={`/tradesmen/${project.business.slug}`}
            className="text-sm text-blue-600 hover:underline"
          >
            ← View all work by {project.business.name}
          </Link>
        </div>
      </main>
    </div>
  );
}
