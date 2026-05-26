export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight">
          Build<span className="text-amber-400">It</span>
        </h1>
        <p className="mb-8 text-xl text-slate-300">
          Showcase your work. Manage your business. Find new customers.
        </p>
        <p className="text-sm text-slate-500">
          Platform for tradesman small businesses — coming soon.
        </p>
      </div>
    </main>
  );
}
