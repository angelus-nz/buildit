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

/* ─── SVG icon components (Heroicons style, 24px viewBox) ─── */
function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
    </svg>
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
  );
}

function HammerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008Z" />
    </svg>
  );
}

function PaintBrushIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
    </svg>
  );
}

function HomeModernIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
    </svg>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a23.56 23.56 0 0 1-8 3.032 23.56 23.56 0 0 1-8-3.032V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25c0 5.385 3.822 9.822 9 10.5M12 8.25C6.814 8.25 2.993 12.687 3 18.073c2.966-.636 5.694-1.79 8.077-3.346" />
    </svg>
  );
}

function FireIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
    </svg>
  );
}

function SquaresIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  );
}

function MagnifyingGlassIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}

function PhotoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
  );
}

function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  );
}

function StarSolidIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006Z" clipRule="evenodd" />
    </svg>
  );
}

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
    </svg>
  );
}

/* ─── Data ─── */
const TRADE_CATEGORIES = [
  { label: "Plumbing", slug: "PLUMBING", Icon: WrenchIcon },
  { label: "Electrical", slug: "ELECTRICAL", Icon: BoltIcon },
  { label: "Carpentry", slug: "CARPENTRY", Icon: HammerIcon },
  { label: "Painting", slug: "PAINTING", Icon: PaintBrushIcon },
  { label: "Roofing", slug: "ROOFING", Icon: HomeModernIcon },
  { label: "Landscaping", slug: "LANDSCAPING", Icon: LeafIcon },
  { label: "HVAC", slug: "HVAC", Icon: FireIcon },
  { label: "Tiling", slug: "TILING", Icon: SquaresIcon },
] as const;

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Search your trade",
    body: "Browse by category and location to find qualified tradesmen in your area.",
    Icon: MagnifyingGlassIcon,
  },
  {
    step: "02",
    title: "View portfolios",
    body: "See real work-in-progress photos, completed projects, and verified customer reviews.",
    Icon: PhotoIcon,
  },
  {
    step: "03",
    title: "Make contact",
    body: "Send a message directly through the platform and get a quote for your job.",
    Icon: ChatBubbleIcon,
  },
] as const;

const TRUST_STATS = [
  { value: "1,200+", label: "Registered tradesmen" },
  { value: "8,400+", label: "Jobs completed" },
  { value: "4.8 / 5", label: "Average rating" },
  { value: "NZ-wide", label: "Coverage" },
] as const;

/* ─── Page ─── */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-slate-900 dark:text-white">
            Build<span className="text-amber-500">It</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/find"
              className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white sm:block"
            >
              Find tradesmen
            </Link>
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
            >
              Join free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,158,11,0.15),transparent)]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-400">
            <ShieldCheckIcon className="h-4 w-4" />
            Trusted by 1,200+ tradesmen across New Zealand
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find trusted tradesmen{" "}
            <span className="text-amber-400">near you</span>
          </h1>
          <p className="mb-10 text-lg text-slate-400 sm:text-xl">
            Browse portfolios, read reviews, and connect with skilled local
            tradesmen for your next project.
          </p>
          <form action="/find" method="GET" className="mx-auto max-w-2xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  name="location"
                  placeholder="Suburb or city"
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 py-3.5 pl-11 pr-4 text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>
              <button
                type="submit"
                className="cursor-pointer rounded-lg bg-amber-500 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-amber-600"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Trust stats */}
      <section className="border-b border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {TRUST_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trade categories */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-3 text-center text-3xl font-bold text-slate-900 dark:text-white">
            Browse by trade
          </h2>
          <p className="mb-10 text-center text-slate-500 dark:text-slate-400">
            Whatever the job, we&apos;ve got a specialist for it.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {TRADE_CATEGORIES.map(({ slug, label, Icon }) => (
              <Link
                key={slug}
                href={`/find?category=${slug}`}
                className="group flex cursor-pointer flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-center transition-all hover:border-amber-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-amber-500"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-16 sm:py-20 dark:bg-slate-900">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-3 text-center text-3xl font-bold text-slate-900 dark:text-white">
            How it works
          </h2>
          <p className="mb-12 text-center text-slate-500 dark:text-slate-400">
            Get connected with the right tradesman in minutes.
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20">
                  <item.Icon className="h-8 w-8" />
                </div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-500/60">
                  Step {item.step}
                </p>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{item.body}</p>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-0.5 w-1/4 bg-slate-200 md:block dark:bg-slate-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tradesman CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <div className="overflow-hidden rounded-2xl bg-slate-900 dark:bg-slate-800">
            <div className="px-8 py-12 text-center sm:px-12">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20">
                <StarSolidIcon className="h-6 w-6 text-amber-400" />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-white sm:text-3xl">
                Are you a tradesman?
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-slate-400">
                Showcase your work, build your reputation, and get found by
                customers in your area — all in one place, for free.
              </p>
              <Link
                href="/auth/register"
                className="inline-block cursor-pointer rounded-lg bg-amber-500 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-amber-600"
              >
                Create your free profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link href="/" className="text-lg font-bold text-slate-900 dark:text-white">
              Build<span className="text-amber-500">It</span>
            </Link>
            <div className="flex gap-6 text-sm text-slate-500">
              <Link href="/find" className="transition-colors hover:text-slate-900 dark:hover:text-white">
                Find tradesmen
              </Link>
              <Link href="/auth/register" className="transition-colors hover:text-slate-900 dark:hover:text-white">
                Join as tradesman
              </Link>
              <Link href="/auth/signin" className="transition-colors hover:text-slate-900 dark:hover:text-white">
                Sign in
              </Link>
            </div>
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} BuildIt
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
