import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const userId = session.user.id;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      business: { select: { id: true, name: true, slug: true, logoUrl: true, userId: true } },
      customer: { select: { id: true, name: true, image: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true, image: true } } },
      },
      participants: { where: { userId }, select: { lastReadAt: true } },
    },
  });

  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isParticipant =
    conversation.customerId === userId || conversation.business.userId === userId;
  if (!isParticipant) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ conversation });
}
