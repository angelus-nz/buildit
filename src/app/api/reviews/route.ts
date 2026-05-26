import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const CreateSchema = z.object({
  businessId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  body: z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const { businessId, rating, body: reviewBody } = parsed.data;

  const business = await prisma.business.findUnique({
    where: { id: businessId, isPublished: true },
    select: { id: true, userId: true },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  if (business.userId === session.user.id) {
    return NextResponse.json({ error: "You cannot review your own business" }, { status: 400 });
  }

  const existing = await prisma.review.findUnique({
    where: { businessId_authorId: { businessId, authorId: session.user.id } },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({ error: "You have already reviewed this business" }, { status: 409 });
  }

  const review = await prisma.review.create({
    data: { businessId, authorId: session.user.id, rating, body: reviewBody ?? null },
    include: { author: { select: { name: true, image: true } } },
  });

  return NextResponse.json(review, { status: 201 });
}
