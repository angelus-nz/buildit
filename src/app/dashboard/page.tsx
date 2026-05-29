import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg"></div>
            <span className="text-xl font-bold">BuildIt</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex space-x-6">
              <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 font-medium">
                Dashboard
              </Link>
              <Link href="/projects" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 font-medium">
                Projects
              </Link>
              <Link href="/quotes" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 font-medium">
                Quotes
              </Link>
            </nav>
            <Button variant="outline" className="h-10 px-4">
              Profile
            </Button>
          </div>
          
          <div className="md:hidden">
            <button className="text-slate-600 dark:text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Link href="/projects/new">
            <Button>Create Project</Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardDescription>Active Projects</CardDescription>
              <CardTitle className="text-3xl">12</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="border border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardDescription>Pending Quotes</CardDescription>
              <CardTitle className="text-3xl">5</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="border border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardDescription>Upcoming Jobs</CardDescription>
              <CardTitle className="text-3xl">3</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="border border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-3xl">$12,450</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Projects Overview */}
        <Card className="border border-slate-200 dark:border-slate-800 mb-8">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Latest updates from your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="font-medium">Kitchen Renovation</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Started 2 weeks ago</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-sm">
                  In Progress
                </span>
              </div>
              
              <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="font-medium">Deck Construction</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Started 3 weeks ago</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm">
                  Planning
                </span>
              </div>
              
              <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="font-medium">Bathroom Remodel</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Started 1 month ago</p>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full text-sm">
                  Completed
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
              <CardDescription>Start a new project for your customers</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Create Project</Button>
            </CardContent>
          </Card>
          
          <Card className="border border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Send Quote</CardTitle>
              <CardDescription>Generate and send a quote to a customer</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Send Quote</Button>
            </CardContent>
          </Card>
          
          <Card className="border border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>View Reports</CardTitle>
              <CardDescription>Check your business performance</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">View Reports</Button>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-amber-500 rounded-lg"></div>
              <span className="text-xl font-bold">BuildIt</span>
            </div>
            <div className="flex space-x-6">
              <Link href="/about" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50">
                About
              </Link>
              <Link href="/terms" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50">
                Terms
              </Link>
              <Link href="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50">
                Privacy
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} BuildIt. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}