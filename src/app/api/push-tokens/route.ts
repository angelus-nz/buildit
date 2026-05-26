import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const Schema = z.object({
  conversationId: z.string().min(1),
  pushToken: z.string().min(1),
});

// Mobile app calls this to register an Expo push token for a conversation.
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { conversationId, pushToken } = parsed.data;
  const userId = session.user.id;

  const updated = await prisma.conversationParticipant.updateMany({
    where: { conversationId, userId },
    data: { pushToken },
  });

  if (updated.count === 0) {
    return NextResponse.json({ error: "Participant not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
