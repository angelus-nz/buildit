import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { BusinessCategory } from "@prisma/client";

const PAGE_SIZE = 12;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") as BusinessCategory | null;
  const location = searchParams.get("location")?.trim() ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

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
        reviews: {
          select: { rating: true },
        },
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
      category: b.category,
      suburb: b.suburb,
      city: b.city,
      logoUrl: b.logoUrl,
      isVerified: b.isVerified,
      reviewCount: b._count.reviews,
      projectCount: b._count.projects,
      avgRating,
    };
  });

  return NextResponse.json({
    businesses: results,
    total,
    page,
    pages: Math.ceil(total / PAGE_SIZE),
  });
}
