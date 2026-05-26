import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const CreateSchema = z.object({
  businessId: z.string().min(1),
  subject: z.string().min(1).max(200),
  firstMessage: z.string().min(1).max(2000),
  inquiryId: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const isTradesman = session.user.role === "TRADESMAN";

  if (isTradesman) {
    const business = await prisma.business.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!business) return NextResponse.json({ conversations: [] });

    const conversations = await prisma.conversation.findMany({
      where: { businessId: business.id },
      orderBy: { updatedAt: "desc" },
      include: {
        customer: { select: { id: true, name: true, image: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
        participants: { where: { userId }, select: { lastReadAt: true } },
      },
    });
    return NextResponse.json({ conversations: conversations.map((c) => serializeConv(c, userId)) });
  }

  const conversations = await prisma.conversation.findMany({
    where: { customerId: userId },
    orderBy: { updatedAt: "desc" },
    include: {
      business: { select: { id: true, name: true, slug: true, logoUrl: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
      participants: { where: { userId }, select: { lastReadAt: true } },
    },
  });
  return NextResponse.json({ conversations: conversations.map((c) => serializeConv(c, userId)) });
}

function serializeConv(conv: {
  id: string;
  subject: string;
  updatedAt: Date;
  messages: { content: string; createdAt: Date; senderId: string }[];
  participants: { lastReadAt: Date }[];
  customer?: { id: string; name: string | null; image: string | null } | null;
  business?: { id: string; name: string; slug: string; logoUrl: string | null } | null;
}, userId: string) {
  const lastReadAt = conv.participants[0]?.lastReadAt ?? new Date(0);
  const lastMsg = conv.messages[0] ?? null;
  const unread = lastMsg && lastMsg.senderId !== userId && new Date(lastMsg.createdAt) > new Date(lastReadAt) ? 1 : 0;
  return {
    id: conv.id,
    subject: conv.subject,
    updatedAt: conv.updatedAt,
    lastMessage: lastMsg ? { content: lastMsg.content, createdAt: lastMsg.createdAt, senderId: lastMsg.senderId } : null,
    unreadCount: unread,
    other: conv.customer ?? conv.business ?? null,
  };
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const { businessId, subject, firstMessage, inquiryId } = parsed.data;
  const customerId = session.user.id;

  const business = await prisma.business.findUnique({
    where: { id: businessId, isPublished: true },
    select: { id: true, userId: true },
  });
  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  if (inquiryId) {
    const existing = await prisma.conversation.findUnique({ where: { inquiryId } });
    if (existing) return NextResponse.json({ id: existing.id }, { status: 200 });
  }

  const conversation = await prisma.$transaction(async (tx) => {
    const conv = await tx.conversation.create({
      data: {
        businessId,
        customerId,
        subject,
        inquiryId: inquiryId ?? null,
        participants: {
          create: [{ userId: customerId }, { userId: business.userId }],
        },
      },
    });
    await tx.message.create({
      data: { conversationId: conv.id, senderId: customerId, content: firstMessage },
    });
    return conv;
  });

  await sendNewConversationEmail(conversation.id, customerId, firstMessage).catch(() => null);

  return NextResponse.json({ id: conversation.id }, { status: 201 });
}

async function sendNewConversationEmail(conversationId: string, senderId: string, content: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participants: { include: { user: { select: { id: true, email: true, name: true } } } },
    },
  });
  if (!conversation) return;

  const recipient = conversation.participants.find((p) => p.userId !== senderId);
  const senderParticipant = conversation.participants.find((p) => p.userId === senderId);
  if (!recipient?.user.email) return;

  const senderName = senderParticipant?.user.name ?? "Someone";
  const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "BuildIt <notifications@buildit.nz>",
      to: [recipient.user.email],
      subject: `New message from ${senderName}: ${conversation.subject}`,
      html: `
        <p>Hi ${recipient.user.name ?? "there"},</p>
        <p><strong>${senderName}</strong> sent you a message about <em>${conversation.subject}</em>:</p>
        <blockquote style="border-left:3px solid #e5e7eb;padding-left:1rem;color:#374151;">
          ${content.replace(/\n/g, "<br/>")}
        </blockquote>
        <p><a href="${appUrl}/messages/${conversationId}">Reply in BuildIt →</a></p>
      `,
    }),
  });
}
