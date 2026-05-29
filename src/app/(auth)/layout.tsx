import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function AuthLayout({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 ${className}`}>
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg"></div>
            <span className="text-xl font-bold">BuildIt</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex space-x-6">
              <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 font-medium">
                Home
              </Link>
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
            <Menu className="h-6 w-6" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
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

export function AuthForm({
  title,
  description,
  children,
  footerLinkText,
  footerLinkHref
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footerLinkText: string;
  footerLinkHref: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{title}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">{description}</p>
        </div>
        {children}
        <div className="mt-6 text-center">
          <Link href={footerLinkHref} className="text-slate-600 dark:text-slate-400 hover:text-amber-500">
            {footerLinkText}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}