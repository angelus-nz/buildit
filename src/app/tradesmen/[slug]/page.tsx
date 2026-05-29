import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CATEGORY_LABELS } from "@/lib/categories";
import { ContactForm } from "./ContactForm";
import { StartConversationButton } from "./StartConversationButton";
import ReviewsSection from "./ReviewsSection";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const business = await prisma.business.findUnique({
    where: { slug, isPublished: true },
    select: { name: true, bio: true, category: true },
  });

  if (!business) return { title: "Not found" };

  return {
    title: `${business.name} — ${CATEGORY_LABELS[business.category]} | BuildIt`,
    description: business.bio?.slice(0, 160) ?? undefined,
  };
}

export default async function TradesmanProfilePage({ params }: Props) {
  const { slug } = await params;
  const session = await auth();

  const business = await prisma.business.findUnique({
    where: { slug, isPublished: true },
    include: {
      user: { select: { name: true } },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true, image: true } } },
      },
      projects: {
        where: { isPublic: true },
        orderBy: [{ status: "asc" }, { createdAt: "desc" }],
        take: 12,
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          _count: { select: { updates: true } },
        },
      },
    },
  });

  if (!business) notFound();

  const locationParts = [business.suburb, business.city, business.state].filter(Boolean);
  const location = locationParts.join(", ");

  const avgRating =
    business.reviews.length > 0
      ? business.reviews.reduce((sum, r) => sum + r.rating, 0) / business.reviews.length
      : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900 dark:text-slate-50 hover:opacity-80">
          BuildIt
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* Hero */}
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 overflow-hidden flex items-center justify-center flex-shrink-0">
              {business.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={business.logoUrl}
                  alt={`${business.name} logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl">🔧</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{business.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <span className="text-sm font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-0.5 rounded-full">
                  {CATEGORY_LABELS[business.category]}
                </span>
                {location && (
                  <span className="text-sm text-slate-500 dark:text-slate-400">📍 {location}</span>
                )}
                {avgRating !== null && (
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    ★ {avgRating.toFixed(1)} ({business.reviews.length}{" "}
                    {business.reviews.length === 1 ? "review" : "reviews"})
                  </span>
                )}
              </div>

              {business.bio && (
                <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                  {business.bio}
                </p>
              )}
            </div>
          </div>

          {(business.phone || business.website) && (
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-4">
              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  📞 {business.phone}
                </a>
              )}
              {business.website && (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline"
                >
                  🌐 Website
                </a>
              )}
            </div>
          )}
        </section>

        {/* Projects feed — active and completed */}
        {business.projects.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Work showcase</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {business.projects.map((project) => {
                const statusLabel =
                  project.status === "IN_PROGRESS"
                    ? "In Progress"
                    : project.status === "PLANNING"
                    ? "Planning"
                    : null;
                const statusColor =
                  project.status === "IN_PROGRESS"
                    ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400"
                    : project.status === "PLANNING"
                    ? "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                    : null;

                return (
                  <Link
                    key={project.id}
                    href={`/tradesmen/${business.slug}/projects/${project.id}`}
                    className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-sm transition-all group"
                  >
                    {project.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.images[0].url}
                        alt={project.title}
                        className="w-full h-40 object-cover group-hover:opacity-95 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-40 bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-300 dark:text-slate-500 text-3xl">
                        🔧
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start gap-2">
                        <h3 className="font-medium text-slate-900 dark:text-white text-sm flex-1">
                          {project.title}
                        </h3>
                        {statusLabel && statusColor && (
                          <span
                            className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${statusColor}`}
                          >
                            {statusLabel}
                          </span>
                        )}
                      </div>
                      {project.description && (
                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 line-clamp-2">
                          {project.description}
                        </p>
                      )}
                      {project._count.updates > 0 && (
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                          {project._count.updates} update{project._count.updates !== 1 ? "s" : ""} →
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Reviews */}
        <ReviewsSection
          businessId={business.id}
          businessUserId={business.userId}
          initialReviews={business.reviews.map((r) => ({
            id: r.id,
            rating: r.rating,
            body: r.body,
            reply: r.reply,
            replyAt: r.replyAt?.toISOString() ?? null,
            createdAt: r.createdAt.toISOString(),
            authorId: r.authorId,
            author: r.author,
          }))}
          avgRating={avgRating}
        />

        {business.reviews.length === 0 && business.projects.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center text-slate-400 dark:text-slate-500 text-sm">
            This business hasn&apos;t added any projects or reviews yet. Check back soon.
          </div>
        )}

        {/* Direct messaging */}
        <section>
          <StartConversationButton
            businessId={business.id}
            businessName={business.name}
            isLoggedIn={!!session}
            isTradesman={session?.user.role === "TRADESMAN"}
          />
        </section>

        {/* Contact form */}
        <ContactForm businessId={business.id} businessName={business.name} />
      </main>
    </div>
  );
}
