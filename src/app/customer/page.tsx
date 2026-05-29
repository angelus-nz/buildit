import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ReviewPrompts from "./ReviewPrompts";

export default function CustomerDashboardPage() {
  return (
    <div>
      <ReviewPrompts />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">My Jobs</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track your active projects and progress updates
        </p>
      </div>

      <div className="space-y-4 mb-10">
        {[
          {
            title: "Kitchen Renovation",
            tradesman: "Mike's Renovations",
            status: "In Progress",
            statusColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
            lastUpdate: "Progress photos added — tiling 70% complete",
            updatedAt: "2 hours ago",
          },
          {
            title: "Deck Construction",
            tradesman: "TimberWorks NZ",
            status: "Planning",
            statusColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            lastUpdate: "Quote accepted. Work starts Monday.",
            updatedAt: "Yesterday",
          },
        ].map((job) => (
          <Card key={job.title} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <CardHeader className="pb-2 flex flex-row items-start justify-between gap-4">
              <div>
                <CardTitle className="text-base font-semibold">{job.title}</CardTitle>
                <CardDescription className="mt-0.5">{job.tradesman}</CardDescription>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${job.statusColor}`}>
                {job.status}
              </span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700 dark:text-slate-300">{job.lastUpdate}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-slate-400">{job.updatedAt}</span>
                <Link href="/messages">
                  <Button size="sm" variant="outline" className="text-xs h-8">
                    Message tradesman
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-base font-semibold">Need more work done?</CardTitle>
          <CardDescription>Find a trusted tradesman in your area</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/find">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white">
              Find a Tradesman
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
