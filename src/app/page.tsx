import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { auth } from "@/lib/auth";

const DEMO_PROJECTS = [
  {
    title: "Kitchen Renovation",
    tradesman: "Mike's Renovations",
    location: "Auckland",
    category: "Kitchen",
    gradient: "from-amber-400 to-orange-500",
    iconPath: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    title: "Deck Construction",
    tradesman: "TimberWorks NZ",
    location: "Wellington",
    category: "Decking",
    gradient: "from-emerald-500 to-teal-600",
    iconPath: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  },
  {
    title: "Bathroom Retile",
    tradesman: "Prestige Tiling Co",
    location: "Christchurch",
    category: "Tiling",
    gradient: "from-blue-500 to-indigo-600",
    iconPath: "M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z",
  },
  {
    title: "New Roof Install",
    tradesman: "Summit Roofing",
    location: "Hamilton",
    category: "Roofing",
    gradient: "from-slate-600 to-slate-800",
    iconPath: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  },
  {
    title: "Electrical Rewire",
    tradesman: "Bright Spark Electrical",
    location: "Tauranga",
    category: "Electrical",
    gradient: "from-yellow-400 to-amber-500",
    iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "Concrete Driveway",
    tradesman: "Solid Ground Co",
    location: "Dunedin",
    category: "Concreting",
    gradient: "from-stone-500 to-stone-700",
    iconPath: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  },
];

export default async function HomePage() {
  const session = await auth();
  const isLoggedIn = !!session;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">BuildIt</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#showcase" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
              Projects
            </a>
            <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
              Features
            </a>
            <Link href="/pricing" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
              Pricing
            </Link>
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm" className="font-medium">
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          <div className="md:hidden">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/auth/signin">
                <Button size="sm" variant="outline">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-8 md:pt-24 md:pb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-slate-50 dark:from-amber-900/10 dark:via-slate-900 dark:to-slate-900" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 px-4 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-400 mb-6">
            Built for New Zealand tradesmen
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            Win more jobs.<br />
            <span className="text-amber-500">Get paid faster.</span>
          </h1>
          <p className="mt-5 text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Showcase your work, manage quotes and invoices, and keep customers in the loop — all from your phone.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white h-12 px-8 text-base font-semibold w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/register">
                  <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white h-12 px-8 text-base font-semibold w-full sm:w-auto">
                    Start for free
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold w-full sm:w-auto border-slate-300 dark:border-slate-700">
                    Sign in
                  </Button>
                </Link>
              </>
            )}
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">No credit card required</p>
        </div>
      </section>

      {/* Project Showcase Strip */}
      <section id="showcase" className="pb-6 md:pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Real NZ jobs from real tradies
            </p>
            <Link href="/auth/register" className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors">
              Share your work →
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:overflow-visible">
            {DEMO_PROJECTS.map((project) => (
              <Link
                key={project.title}
                href="/auth/register"
                className="group flex-shrink-0 w-40 sm:w-auto rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className={`relative h-40 sm:h-36 bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d={project.iconPath} />
                  </svg>
                  <div className="absolute bottom-2 left-2">
                    <span className="inline-block bg-black/30 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded-full">
                      {project.category}
                    </span>
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-800 px-3 py-2.5 border border-t-0 border-slate-100 dark:border-slate-700 rounded-b-2xl">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-50 truncate">{project.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{project.tradesman}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{project.location}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <div className="border-y border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            <span>Trusted by 500+ tradesmen</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>Council consent ready</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
            <span>Mobile-first design</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Everything you need to run your trade business
            </h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
              From your first quote to the final invoice — BuildIt has you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                iconPath: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
                title: "Project Showcase",
                description: "Share live progress photos and updates with customers. Build trust and reduce check-in calls.",
              },
              {
                iconPath: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                title: "Quotes & Invoices",
                description: "Create professional quotes and invoices in seconds. Get paid faster with online payment links.",
              },
              {
                iconPath: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
                title: "Council Consents",
                description: "Pre-filled council consent forms from your project details. Reduce paperwork and delays.",
              },
              {
                iconPath: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 11.574 3 10c0-4.418 4.03-8 9-8s9 3.582 9 8z",
                title: "Customer Messaging",
                description: "All your customer conversations in one place. Never miss a job inquiry again.",
              },
              {
                iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.858M17 20H7m10 0v-2c0-.656-.126-1.289-.356-1.858M7 20H2v-2a3 3 0 015.356-1.858M7 20v-2c0-.656.126-1.289.356-1.858m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                title: "Find Customers",
                description: "Get listed in our tradesperson marketplace and connect with customers in your area.",
              },
              {
                iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                title: "Business Dashboard",
                description: "See your revenue, active jobs, and outstanding invoices at a glance. Know your numbers.",
              },
            ].map((feature) => (
              <Card key={feature.title} className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.iconPath} />
                    </svg>
                  </div>
                  <CardTitle className="text-base font-semibold">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 md:py-28 bg-slate-50 dark:bg-slate-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Trusted by tradesmen across NZ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                quote: "BuildIt helped us showcase our work to customers in a way that really built trust. Our conversion rate has increased significantly since we started using it.",
                name: "Mike Thompson",
                role: "Construction Contractor, Auckland",
                initials: "MT",
                color: "bg-amber-500",
              },
              {
                quote: "The invoice tools have saved us countless hours. We've been able to streamline our processes and focus more on what matters — building great projects.",
                name: "Sarah Johnson",
                role: "Kitchen Remodeler, Wellington",
                initials: "SJ",
                color: "bg-slate-600",
              },
            ].map((t) => (
              <div key={t.name} className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-sm font-bold">{t.initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            Ready to grow your trade business?
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Join hundreds of tradespeople already using BuildIt. Free to get started.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white h-12 px-8 text-base font-semibold w-full sm:w-auto">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/auth/register">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white h-12 px-8 text-base font-semibold w-full sm:w-auto">
                  Create free account
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-amber-500 rounded-lg" />
              <span className="font-bold">BuildIt</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-500 dark:text-slate-400">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">Dashboard</Link>
                  <Link href="/dashboard/projects" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">Projects</Link>
                  <Link href="/dashboard/invoices" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">Invoices</Link>
                </>
              ) : (
                <>
                  <Link href="/pricing" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">Pricing</Link>
                  <Link href="/auth/signin" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">Sign in</Link>
                  <Link href="/auth/register" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">Sign up</Link>
                </>
              )}
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-slate-400 dark:text-slate-500">
            © {new Date().getFullYear()} BuildIt. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
