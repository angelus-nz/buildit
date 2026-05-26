import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ConversationClient } from "./ConversationClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const conv = await prisma.conversation.findUnique({ where: { id }, select: { subject: true } });
  return { title: conv ? `${conv.subject} — Messages — BuildIt` : "Messages — BuildIt" };
}

export default async function ConversationPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const { id } = await params;
  const userId = session.user.id;

  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: {
      business: { select: { id: true, name: true, slug: true, userId: true } },
      customer: { select: { id: true, name: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { id: true, name: true, image: true } } },
      },
    },
  });

  if (!conversation) notFound();

  const isParticipant =
    conversation.customerId === userId || conversation.business.userId === userId;
  if (!isParticipant) notFound();

  const isTradesman = session.user.role === "TRADESMAN";
  const otherName = isTradesman
    ? (conversation.customer.name ?? "Customer")
    : conversation.business.name;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <Link href="/dashboard" className="text-lg font-semibold text-gray-900 hover:opacity-80">
          BuildIt
        </Link>
        <Link href="/messages" className="text-sm text-gray-500 hover:text-gray-700">
          ← Messages
        </Link>
      </header>

      <main className="flex-1 flex flex-col max-w-2xl w-full mx-auto px-4 py-6">
        <div
          className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col"
          style={{ minHeight: "500px" }}
        >
          <ConversationClient
            conversationId={id}
            currentUserId={userId}
            subject={conversation.subject}
            otherName={otherName}
            initialMessages={conversation.messages.map((m) => ({
              id: m.id,
              content: m.content,
              createdAt: m.createdAt.toISOString(),
              senderId: m.senderId,
              sender: { id: m.sender.id, name: m.sender.name, image: m.sender.image },
            }))}
          />
        </div>
      </main>
    </div>
  );
}
