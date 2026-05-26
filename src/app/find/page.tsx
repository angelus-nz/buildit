import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import type { BusinessCategory } from "@prisma/client";
import DirectoryClient from "./DirectoryClient";

interface SearchParams {
  category?: string;
  location?: string;
  page?: string;
}

const PAGE_SIZE = 12;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const category = params.category ?? "";
  const location = params.location ?? "";

  const parts = ["Find Tradesmen"];
  if (category)
    parts.push(category.charAt(0) + category.slice(1).toLowerCase());
  if (location) parts.push(`in ${location}`);

  const title = `${parts.join(" · ")} — BuildIt`;
  const description = `Browse ${category ? category.toLowerCase() : "all"} tradesmen${location ? ` in ${location}` : ""} on BuildIt. View portfolios, read reviews, and contact local professionals.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

async function getBusinesses(params: SearchParams) {
  const category = params.category as BusinessCategory | undefined;
  const location = params.location?.trim() ?? "";
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const where = {
    isPublished: true,
    ...(category ? { category } : {}),
    ...(location
      ? {
          OR: [
            { suburb: { contains: location, mode: "insensitive" as const } },
            { city: { contains: location, mode: "insensitive" as const } },
            { state: { contains: location, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [businesses, total] = await Promise.all([
    prisma.business.findMany({
      where,
      orderBy: [{ isVerified: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        slug: true,
        bio: true,
        category: true,
        suburb: true,
        city: true,
        logoUrl: true,
        isVerified: true,
        _count: { select: { reviews: true, projects: true } },
        reviews: { select: { rating: true } },
      },
    }),
    prisma.business.count({ where }),
  ]);

  const results = businesses.map((b) => {
    const avgRating =
      b.reviews.length > 0
        ? b.reviews.reduce((sum, r) => sum + r.rating, 0) / b.reviews.length
        : null;
    return {
      id: b.id,
      name: b.name,
      slug: b.slug,
      bio: b.bio,
      category: b.category as string,
      suburb: b.suburb,
      city: b.city,
      logoUrl: b.logoUrl,
      isVerified: b.isVerified,
      reviewCount: b._count.reviews,
      projectCount: b._count.projects,
      avgRating,
    };
  });

  return {
    businesses: results,
    total,
    page,
    pages: Math.ceil(total / PAGE_SIZE),
  };
}

export default async function FindPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { businesses, total, page, pages } = await getBusinesses(params);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            Build<span className="text-amber-500">It</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
            >
              Join as tradesman
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="mb-2 text-3xl font-bold text-slate-900">
          Find tradesmen
        </h1>
        <p className="mb-8 text-slate-500">
          Search by location and trade to find qualified professionals near you.
        </p>

        <Suspense fallback={null}>
          <DirectoryClient
            initialBusinesses={businesses}
            initialTotal={total}
            initialPages={pages}
            initialPage={page}
          />
        </Suspense>
      </main>
    </div>
  );
}
