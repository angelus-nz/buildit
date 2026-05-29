import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function HomePage() {
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
              <Link href="/projects" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 font-medium">
                Projects
              </Link>
              <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 font-medium">
                Dashboard
              </Link>
            </nav>
            <Button variant="outline" className="h-10 px-4">
              Sign in
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

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-amber-50 dark:from-slate-900 dark:to-amber-900/10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold max-w-3xl mx-auto leading-tight">
            Showcase Your Work in Progress to Customers
          </h1>
          <p className="mt-6 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            BuildIt helps tradesmen small businesses showcase work in progress, manage their business, and find new customers.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="text-base px-8 py-6">Get Started Free</Button>
            </Link>
            <Button variant="outline" size="lg" className="text-base px-8 py-6">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">
              Powerful Tools for Tradesmen
            </h2>
            <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
              Everything you need to grow your small business
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-500 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <CardTitle>Project Showcase</CardTitle>
                <CardDescription>
                  Display your work in progress to customers and build trust with transparent updates.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-500 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <CardTitle>Business Management</CardTitle>
                <CardDescription>
                  Handle quotes, invoices, scheduling, and customer communication all in one place.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="border border-slate-200 dark:border-slate-800">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-amber-500 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.858M17 20H7m10 0v-2c0-.656-.126-1.289-.356-1.858M7 20H2v-2a3 3 0 015.356-1.858M7 20v-2c0-.656.126-1.289.356-1.858m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <CardTitle>Customer Marketplace</CardTitle>
                <CardDescription>
                  Find new customers and grow your business with our integrated marketplace.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-slate-100 dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">
              Trusted by Tradesmen
            </h2>
            <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
              Join thousands of small businesses growing with BuildIt
            </p>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600">
              <p className="text-slate-600 dark:text-slate-300 italic">
                &ldquo;BuildIt helped us showcase our work to customers in a way that really built trust. Our conversion rate has increased significantly since we started using it.&rdquo;
              </p>
              <div className="mt-6 flex items-center">
                <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
                  <span className="text-white font-bold">JD</span>
                </div>
                <div className="ml-4">
                  <p className="font-medium">John Doe</p>
                  <p className="text-slate-600 dark:text-slate-400">Construction Contractor</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-600">
              <p className="text-slate-600 dark:text-slate-300 italic">
                &ldquo;The business management tools have saved us countless hours. We&apos;ve been able to streamline our processes and focus more on what matters - building great projects.&rdquo;
              </p>
              <div className="mt-6 flex items-center">
                <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
                  <span className="text-white font-bold">SJ</span>
                </div>
                <div className="ml-4">
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-slate-600 dark:text-slate-400">Kitchen Remodeler</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Transform Your Business?
          </h2>
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Join thousands of tradesmen who trust BuildIt to grow their businesses.
          </p>
          <div className="mt-10">
            <Link href="/register">
              <Button size="lg" className="text-base px-8 py-6">Get Started Free</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 py-12">
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
          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} BuildIt. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}