import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CATEGORY_LABELS } from "@/lib/categories";
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

  const business = await prisma.business.findUnique({
    where: { slug, isPublished: true },
    include: {
      user: { select: { name: true } },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { author: { select: { name: true, image: true } } },
      },
      projects: {
        where: { status: "COMPLETED" },
        orderBy: { completedAt: "desc" },
        take: 6,
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <a href="/" className="text-lg font-semibold text-gray-900 hover:opacity-80">
          BuildIt
        </a>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* Hero */}
        <section className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
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
              <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-1">
                <span className="text-sm font-medium text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {CATEGORY_LABELS[business.category]}
                </span>
                {location && (
                  <span className="text-sm text-gray-500">📍 {location}</span>
                )}
                {avgRating !== null && (
                  <span className="text-sm text-gray-500">
                    ★ {avgRating.toFixed(1)} ({business.reviews.length}{" "}
                    {business.reviews.length === 1 ? "review" : "reviews"})
                  </span>
                )}
              </div>

              {business.bio && (
                <p className="mt-4 text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {business.bio}
                </p>
              )}
            </div>
          </div>

          {(business.phone || business.website) && (
            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-4">
              {business.phone && (
                <a
                  href={`tel:${business.phone}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  📞 {business.phone}
                </a>
              )}
              {business.website && (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
                >
                  🌐 Website
                </a>
              )}
            </div>
          )}
        </section>

        {/* Completed projects */}
        {business.projects.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent work</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {business.projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  {project.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.images[0].url}
                      alt={project.title}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 text-sm">{project.title}</h3>
                    {project.description && (
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        {business.reviews.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h2>
            <div className="space-y-4">
              {business.reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-xl border border-gray-200 p-5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-sm">
                      {review.author.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={review.author.image}
                          alt={review.author.name ?? ""}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        review.author.name?.[0] ?? "?"
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {review.author.name ?? "Anonymous"}
                      </p>
                      <p className="text-xs text-yellow-500">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </p>
                    </div>
                  </div>
                  {review.body && (
                    <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {business.reviews.length === 0 && business.projects.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
            This business hasn&apos;t added any work yet. Check back soon.
          </div>
        )}
      </main>
    </div>
  );
}
