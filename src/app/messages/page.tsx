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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-semibold text-slate-900 dark:text-slate-50 hover:opacity-80">
          BuildIt
        </Link>
        <Link href="/dashboard" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
          ← Dashboard
        </Link>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">Messages</h1>

        {conversations.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center text-slate-400 dark:text-slate-500 text-sm shadow-sm">
            No conversations yet.
            {!isTradesman && (
              <p className="mt-2">
                <Link href="/find" className="text-amber-600 dark:text-amber-400 hover:underline">
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
                className={`block bg-white dark:bg-slate-800 rounded-xl border px-5 py-4 hover:border-amber-400 dark:hover:border-amber-600 transition-colors shadow-sm ${
                  conv.unreadCount > 0 ? "border-amber-400 dark:border-amber-600" : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {conv.unreadCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${conv.unreadCount > 0 ? "text-slate-900 dark:text-slate-50" : "text-slate-700 dark:text-slate-300"}`}>
                        {conv.subject}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {conv.other.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {new Date(conv.updatedAt).toLocaleDateString()}
                    </p>
                    {conv.lastMessage && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[8rem] mt-0.5">
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
