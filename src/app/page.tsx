import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BuildIt — Find Trusted Tradesmen Near You",
  description:
    "Connect with skilled local tradesmen. Browse portfolios, read reviews, and get quotes for plumbing, electrical, carpentry, and more.",
  openGraph: {
    title: "BuildIt — Find Trusted Tradesmen Near You",
    description:
      "Connect with skilled local tradesmen. Browse portfolios, read reviews, and get quotes for plumbing, electrical, carpentry, and more.",
    type: "website",
  },
};

const TRADE_CATEGORIES = [
  { label: "Plumbing", slug: "PLUMBING", icon: "🔧" },
  { label: "Electrical", slug: "ELECTRICAL", icon: "⚡" },
  { label: "Carpentry", slug: "CARPENTRY", icon: "🪚" },
  { label: "Painting", slug: "PAINTING", icon: "🎨" },
  { label: "Roofing", slug: "ROOFING", icon: "🏠" },
  { label: "Landscaping", slug: "LANDSCAPING", icon: "🌿" },
  { label: "HVAC", slug: "HVAC", icon: "❄️" },
  { label: "Tiling", slug: "TILING", icon: "🟫" },
] as const;

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Search your trade",
    body: "Browse by trade category and location to find qualified tradesmen in your area.",
  },
  {
    step: "2",
    title: "View portfolios",
    body: "See real work-in-progress photos, completed projects, and verified customer reviews.",
  },
  {
    step: "3",
    title: "Make contact",
    body: "Send a message directly through the platform and get a quote for your job.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-slate-900">
            Build<span className="text-amber-500">It</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/find"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Find tradesmen
            </Link>
            <Link
              href="/auth/signin"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
            >
              Join as tradesman
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-24 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight">
            Find trusted tradesmen{" "}
            <span className="text-amber-400">near you</span>
          </h1>
          <p className="mb-10 text-xl text-slate-300">
            Browse portfolios, read reviews, and connect with skilled local
            tradesmen for your next project.
          </p>
          <form action="/find" method="GET" className="mx-auto max-w-2xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                name="location"
                placeholder="Suburb or city"
                className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 focus:border-amber-400 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg bg-amber-500 px-8 py-3 font-semibold text-white hover:bg-amber-600"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Trade categories */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">
            Browse by trade
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {TRADE_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/find?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-6 text-center transition hover:border-amber-400 hover:shadow-md"
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="font-medium text-slate-800">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-12 text-center text-2xl font-bold text-slate-900">
            How it works
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tradesman CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Are you a tradesman?
          </h2>
          <p className="mb-8 text-slate-600">
            Showcase your work, build your reputation, and get found by
            customers in your area — all in one place.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block rounded-lg bg-slate-900 px-8 py-3 font-semibold text-white hover:bg-slate-700"
          >
            Create your free profile
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} BuildIt. Connecting customers with
          trusted tradesmen.
        </div>
      </footer>
    </div>
  );
}
