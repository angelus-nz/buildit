import type { NextAuthConfig } from "next-auth";

// Edge-compatible auth config — no Prisma, no bcrypt, no Node.js-only modules.
// Used by middleware to validate JWT sessions without hitting the database.
export const authConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id!;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        session.user.role = token.role as any;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
