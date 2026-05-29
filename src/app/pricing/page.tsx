import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    tagline: "Get started with the basics",
    targetUser: "Sole traders just starting out",
    cta: "Get started free",
    ctaHref: "/auth/register",
    highlighted: false,
    features: [
      "1 active project",
      "Up to 3 customers",
      "Basic project showcase",
      "Quote creation (5/month)",
      "Invoice creation (5/month)",
      "BuildIt marketplace listing",
      "Mobile app access",
    ],
    missing: [
      "Unlimited projects",
      "Council consent forms",
      "Priority marketplace placement",
      "Analytics dashboard",
      "Custom business branding",
    ],
  },
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    tagline: "For growing trade businesses",
    targetUser: "Small teams with 1–5 employees",
    cta: "Start Pro trial",
    ctaHref: "/auth/register?plan=pro",
    highlighted: true,
    badge: "Most popular",
    features: [
      "Unlimited active projects",
      "Unlimited customers",
      "Full project showcase with photos",
      "Unlimited quotes & invoices",
      "Council consent forms",
      "Priority marketplace placement",
      "Analytics dashboard",
      "Customer messaging",
      "Mobile app access",
    ],
    missing: [
      "Custom business branding",
      "Dedicated account manager",
    ],
  },
  {
    name: "Business",
    price: "$129",
    period: "per month",
    tagline: "For established trade operations",
    targetUser: "Larger teams and multi-trade businesses",
    cta: "Contact us",
    ctaHref: "mailto:hello@buildit.angelus.nz?subject=Business Plan Enquiry",
    highlighted: false,
    features: [
      "Everything in Pro",
      "Custom business branding",
      "Multi-user team accounts",
      "Dedicated account manager",
      "Priority support",
      "API access",
      "Custom integrations",
      "Advanced analytics",
    ],
    missing: [],
  },
];

const CheckIcon = () => (
  <svg className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const CrossIcon = () => (
  <svg className="h-4 w-4 text-slate-300 dark:text-slate-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default async function PricingPage() {
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
            <Link href="/#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-amber-600 dark:text-amber-400">
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
                  <Button variant="ghost" size="sm" className="font-medium">Sign in</Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">Get Started</Button>
                </Link>
              </div>
            )}
          </nav>

          <div className="md:hidden">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">Dashboard</Button>
              </Link>
            ) : (
              <Link href="/auth/signin">
                <Button size="sm" variant="outline">Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20 px-4 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-400 mb-6">
            Simple, transparent pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Plans that grow with<br />
            <span className="text-amber-500">your trade business</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Start free. Upgrade when you&rsquo;re ready. No lock-in contracts.
          </p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="pb-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 flex flex-col ${
                  plan.highlighted
                    ? "border-amber-400 bg-amber-50 dark:bg-amber-900/10 shadow-lg shadow-amber-100 dark:shadow-amber-900/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h2 className="text-lg font-bold">{plan.name}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{plan.tagline}</p>
                  <div className="mt-4 flex items-end gap-1">
                    <span className="text-4xl font-bold tracking-tight">{plan.price}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm pb-1">/{plan.period}</span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{plan.targetUser}</p>
                </div>

                <Link href={plan.ctaHref} className="block mb-8">
                  <Button
                    className={`w-full font-semibold ${
                      plan.highlighted
                        ? "bg-amber-500 hover:bg-amber-600 text-white"
                        : "bg-slate-900 hover:bg-slate-700 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>

                <div className="flex flex-col gap-3 flex-1">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <CheckIcon />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                    </div>
                  ))}
                  {plan.missing.map((feature) => (
                    <div key={feature} className="flex items-start gap-2.5">
                      <CrossIcon />
                      <span className="text-sm text-slate-400 dark:text-slate-600">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
            All prices in NZD. GST not included.{" "}
            <Link href="mailto:hello@buildit.angelus.nz" className="text-amber-600 hover:text-amber-700 underline">
              Contact us
            </Link>{" "}
            for annual pricing.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-slate-50 dark:bg-slate-800/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Frequently asked questions</h2>
          <div className="flex flex-col gap-6">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes. There are no lock-in contracts. You can cancel your subscription at any time and your plan will remain active until the end of the billing period.",
              },
              {
                q: "What happens to my data if I cancel?",
                a: "Your projects, invoices, and customer data are retained for 90 days after cancellation. You can export everything before then.",
              },
              {
                q: "Can I upgrade or downgrade my plan?",
                a: "Absolutely. You can change plans at any time. Upgrades take effect immediately; downgrades apply at the next billing cycle.",
              },
              {
                q: "Is payment secure?",
                a: "Payments are processed securely via Stripe. BuildIt never stores your card details.",
              },
            ].map((item) => (
              <div key={item.q} className="border-b border-slate-200 dark:border-slate-700 pb-6 last:border-0">
                <h3 className="font-semibold text-base mb-2">{item.q}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Ready to get started?
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Join hundreds of NZ tradespeople already growing their business with BuildIt.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white h-12 px-8 text-base font-semibold">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/register">
                  <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white h-12 px-8 text-base font-semibold">
                    Start for free
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base font-semibold border-slate-300 dark:border-slate-700">
                    Sign in
                  </Button>
                </Link>
              </>
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
              <Link href="/" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">Home</Link>
              <Link href="/pricing" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">Pricing</Link>
              <Link href="/auth/signin" className="hover:text-slate-900 dark:hover:text-slate-50 transition-colors">Sign in</Link>
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
