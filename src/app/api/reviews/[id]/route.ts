import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const ReplySchema = z.object({
  reply: z.string().min(1).max(2000),
});

interface Params {
  params: Promise<{ id: string }>;
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const review = await prisma.review.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  if (review.authorId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.review.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const reviewWithBusiness = await prisma.review.findUnique({
    where: { id },
    include: { business: { select: { userId: true } } },
  });

  if (!reviewWithBusiness) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  if (reviewWithBusiness.business.userId !== session.user.id) {
    return NextResponse.json({ error: "Only the business owner can reply" }, { status: 403 });
  }

  if (reviewWithBusiness.reply) {
    return NextResponse.json({ error: "A reply already exists for this review" }, { status: 409 });
  }

  const body = await req.json().catch(() => null);
  const parsed = ReplySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const updated = await prisma.review.update({
    where: { id },
    data: { reply: parsed.data.reply, replyAt: new Date() },
    include: { author: { select: { name: true, image: true } }, business: { select: { name: true } } },
  });

  return NextResponse.json(updated);
}
