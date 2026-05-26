import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { sendMessageEmail } from "@/lib/email";

const SendSchema = z.object({
  content: z.string().min(1).max(2000),
});

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: conversationId } = await params;
  const userId = session.user.id;

  const body = await req.json().catch(() => null);
  const parsed = SendSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      business: { select: { userId: true } },
      participants: { include: { user: { select: { id: true, email: true, name: true } } } },
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

  const [message] = await prisma.$transaction([
    prisma.message.create({
      data: { conversationId, senderId: userId, content: parsed.data.content },
      include: { sender: { select: { id: true, name: true, image: true } } },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    }),
    prisma.conversationParticipant.updateMany({
      where: { conversationId, userId },
      data: { lastReadAt: new Date() },
    }),
  ]);

  const recipient = conversation.participants.find((p) => p.userId !== userId);
  const senderParticipant = conversation.participants.find((p) => p.userId === userId);

  if (recipient?.user.email) {
    await sendMessageEmail({
      toEmail: recipient.user.email,
      toName: recipient.user.name ?? "there",
      fromName: senderParticipant?.user.name ?? "Someone",
      subject: conversation.subject,
      content: parsed.data.content,
      conversationId,
    }).catch(() => null);
  }

  await sendExpoPush(recipient?.pushToken, conversation.subject, parsed.data.content, conversationId);

  return NextResponse.json({ message }, { status: 201 });
}

async function sendExpoPush(
  pushToken: string | null | undefined,
  subject: string,
  content: string,
  conversationId: string,
) {
  if (!pushToken) return;
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: pushToken,
      title: `New message: ${subject}`,
      body: content.slice(0, 100),
      data: { screen: "messages", conversationId },
    }),
  }).catch(() => null);
}
