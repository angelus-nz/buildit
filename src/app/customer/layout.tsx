import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const userName = session.user.name ?? session.user.email ?? "Customer";
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/customer" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-500 rounded-lg" />
            <span className="font-bold">
              Build<span className="text-amber-500">It</span>
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium">
            <Link href="/customer" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50">
              My Jobs
            </Link>
            <Link href="/messages" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50">
              Messages
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/profile/edit" className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900">
              <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold text-white">
                {initials}
              </div>
              <span className="hidden sm:block">{userName}</span>
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button type="submit" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
