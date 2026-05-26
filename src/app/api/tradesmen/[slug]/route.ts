import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
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

  if (!business) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ business });
}
