import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardNav } from "./DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  const isTradesman = session.user.role === "TRADESMAN";
  const userName = session.user.name ?? session.user.email ?? "User";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNav
        userName={userName}
        userRole={session.user.role}
        isTradesman={isTradesman}
      />
      {/* pt-14 offsets the mobile fixed header; lg:pl-64 offsets the desktop sidebar */}
      <main className="min-h-screen pt-14 lg:pl-64 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
