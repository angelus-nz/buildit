import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Messages — BuildIt" };

export default async function MessagesPage() {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const userId = session.user.id;
  const isTradesman = session.user.role === "TRADESMAN";

  let conversations: {
    id: string;
    subject: string;
    updatedAt: Date;
    lastMessage: { content: string; createdAt: Date; senderId: string } | null;
    unreadCount: number;
    other: { id: string; name: string | null; image?: string | null; slug?: string; logoUrl?: string | null };
  }[] = [];

  if (isTradesman) {
    const business = await prisma.business.findUnique({ where: { userId }, select: { id: true } });
    if (business) {
      const rows = await prisma.conversation.findMany({
        where: { businessId: business.id },
        orderBy: { updatedAt: "desc" },
        include: {
          customer: { select: { id: true, name: true, image: true } },
          messages: { orderBy: { createdAt: "desc" }, take: 1 },
          participants: { where: { userId }, select: { lastReadAt: true } },
        },
      });
      conversations = rows.map((c) => {
        const lastMsg = c.messages[0] ?? null;
        const lastReadAt = c.participants[0]?.lastReadAt ?? new Date(0);
        const unread = lastMsg && lastMsg.senderId !== userId && new Date(lastMsg.createdAt) > new Date(lastReadAt) ? 1 : 0;
        return { id: c.id, subject: c.subject, updatedAt: c.updatedAt, lastMessage: lastMsg, unreadCount: unread, other: c.customer };
      });
    }
  } else {
    const rows = await prisma.conversation.findMany({
      where: { customerId: userId },
      orderBy: { updatedAt: "desc" },
      include: {
        business: { select: { id: true, name: true, slug: true, logoUrl: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
        participants: { where: { userId }, select: { lastReadAt: true } },
      },
    });
    conversations = rows.map((c) => {
      const lastMsg = c.messages[0] ?? null;
      const lastReadAt = c.participants[0]?.lastReadAt ?? new Date(0);
      const unread = lastMsg && lastMsg.senderId !== userId && new Date(lastMsg.createdAt) > new Date(lastReadAt) ? 1 : 0;
      return { id: c.id, subject: c.subject, updatedAt: c.updatedAt, lastMessage: lastMsg, unreadCount: unread, other: c.business };
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-semibold text-gray-900 hover:opacity-80">
          BuildIt
        </Link>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
          ← Dashboard
        </Link>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>

        {conversations.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 text-sm">
            No conversations yet.
            {!isTradesman && (
              <p className="mt-2">
                <Link href="/find" className="text-blue-600 hover:underline">
                  Find a tradesperson
                </Link>{" "}
                to start a conversation.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/messages/${conv.id}`}
                className={`block bg-white rounded-xl border px-5 py-4 hover:border-blue-300 transition-colors ${
                  conv.unreadCount > 0 ? "border-blue-400" : "border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {conv.unreadCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${conv.unreadCount > 0 ? "text-gray-900" : "text-gray-700"}`}>
                        {conv.subject}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {conv.other.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-400">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </p>
                    {conv.lastMessage && (
                      <p className="text-xs text-gray-500 truncate max-w-[8rem] mt-0.5">
                        {conv.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
