import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your business at a glance</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="bg-amber-500 hover:bg-amber-600 text-white">
            + New Project
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Projects", value: "12", delta: "+2 this week" },
          { label: "Pending Quotes", value: "5", delta: "2 expiring soon" },
          { label: "Upcoming Jobs", value: "3", delta: "Next: tomorrow" },
          { label: "Revenue (MTD)", value: "$12,450", delta: "+8% vs last month" },
        ].map((stat) => (
          <Card key={stat.label} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs font-medium uppercase tracking-wide">{stat.label}</CardDescription>
              <CardTitle className="text-2xl font-bold">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-500 dark:text-slate-400">{stat.delta}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base font-semibold">Recent Projects</CardTitle>
              <Link href="/dashboard/projects" className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                View all →
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {[
                { name: "Kitchen Renovation", updated: "2 hours ago", status: "In Progress", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
                { name: "Deck Construction", updated: "Yesterday", status: "Planning", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
                { name: "Bathroom Remodel", updated: "3 days ago", status: "Completed", color: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
              ].map((project, i) => (
                <div key={project.name} className={`flex items-center justify-between px-6 py-4 ${i < 2 ? "border-b border-slate-100 dark:border-slate-800" : ""}`}>
                  <div>
                    <p className="font-medium text-sm">{project.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Updated {project.updated}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${project.color}`}>
                    {project.status}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Link href="/dashboard/projects/new">
                <Button variant="outline" className="w-full justify-start text-sm">+ Create Project</Button>
              </Link>
              <Link href="/dashboard/quotes/new">
                <Button variant="outline" className="w-full justify-start text-sm">+ Send Quote</Button>
              </Link>
              <Link href="/dashboard/invoices/new">
                <Button variant="outline" className="w-full justify-start text-sm">+ New Invoice</Button>
              </Link>
              <Link href="/consents/new">
                <Button variant="outline" className="w-full justify-start text-sm">+ Council Consent</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Account</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Link href="/profile/edit">
                <Button variant="outline" className="w-full justify-start text-sm">Edit Profile</Button>
              </Link>
              <Link href="/profile/onboard">
                <Button variant="outline" className="w-full justify-start text-sm">Business Setup</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold bg-amber-500 text-white px-2 py-0.5 rounded-full">Free plan</span>
              </div>
              <CardTitle className="text-base font-semibold">Upgrade to Pro</CardTitle>
              <CardDescription className="text-xs">Unlock unlimited projects, council consents, and priority marketplace placement.</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/pricing">
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold">
                  See pricing →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
