import type { NextAuthConfig } from "next-auth";

// Edge-safe config: no providers here (Credentials + bcrypt + Prisma pull in
// Node APIs), so this is what the middleware uses to just check the session.
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/bejelentkezes",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.uid = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.uid === "string") {
        session.user.id = token.uid;
      }
      if (session.user && typeof token.role === "string") {
        session.user.role = token.role as "MEMBER" | "STAFF";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
