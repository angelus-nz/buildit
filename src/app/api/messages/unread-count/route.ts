import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// Returns total number of conversations where the current user has unread messages.
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ count: 0 });
  }

  const userId = session.user.id;

  const participants = await prisma.conversationParticipant.findMany({
    where: { userId },
    select: {
      lastReadAt: true,
      conversation: {
        select: {
          messages: {
            where: { senderId: { not: userId } },
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { createdAt: true },
          },
        },
      },
    },
  });

  const unread = participants.filter((p) => {
    const lastMsg = p.conversation.messages[0];
    return lastMsg && new Date(lastMsg.createdAt) > new Date(p.lastReadAt);
  }).length;

  return NextResponse.json({ count: unread });
}
