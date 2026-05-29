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
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Messages</h1>

      {conversations.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-400">No conversations yet.</p>
          {!isTradesman && (
            <p className="mt-2 text-sm text-slate-400">
              <Link href="/find" className="font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400">
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
              className={`block rounded-xl border bg-white px-5 py-4 transition-colors hover:border-amber-300 dark:bg-slate-800 dark:hover:border-amber-600 ${
                conv.unreadCount > 0
                  ? "border-amber-400 dark:border-amber-500"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {conv.unreadCount > 0 && (
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-amber-500" />
                  )}
                  <div className="min-w-0">
                    <p
                      className={`truncate text-sm font-medium ${
                        conv.unreadCount > 0
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {conv.subject}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                      {conv.other.name}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-xs text-slate-400">
                    {new Date(conv.updatedAt).toLocaleDateString()}
                  </p>
                  {conv.lastMessage && (
                    <p className="mt-0.5 max-w-[8rem] truncate text-xs text-slate-500 dark:text-slate-400">
                      {conv.lastMessage.content}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
