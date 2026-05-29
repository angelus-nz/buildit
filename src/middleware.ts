import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

// Edge-safe auth: uses JWT-only config without Prisma or bcrypt
const { auth } = NextAuth(authConfig);

const PROTECTED_PREFIXES = ["/dashboard", "/profile", "/customer"];
const AUTH_PATHS = ["/auth/signin", "/auth/register"];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const pathname = nextUrl.pathname;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtected && !session) {
    const signinUrl = new URL("/auth/signin", nextUrl.origin);
    signinUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signinUrl);
  }

  // After sign-in, redirect logged-in users away from auth pages by role.
  if (AUTH_PATHS.includes(pathname) && session) {
    const role = (session as { user?: { role?: string } }).user?.role;
    const dest = role === "CUSTOMER" ? "/customer" : "/dashboard";
    return NextResponse.redirect(new URL(dest, nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
