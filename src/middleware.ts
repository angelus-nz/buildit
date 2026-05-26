import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard"];
const AUTH_PATHS = ["/auth/signin", "/auth/register"];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    nextUrl.pathname.startsWith(prefix)
  );

  if (isProtected && !session) {
    const signinUrl = new URL("/auth/signin", nextUrl.origin);
    signinUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(signinUrl);
  }

  if (AUTH_PATHS.includes(nextUrl.pathname) && session) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
