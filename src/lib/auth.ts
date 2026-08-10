import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Jelszó", type: "password" },
      },
      authorize: async (credentials, request) => {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const normalizedEmail = email.toLowerCase().trim();
        const ip = getClientIp(request);
        // Keyed on IP + email so one bad actor guessing many accounts from
        // one IP is throttled, without letting a single mistyped password
        // lock out everyone sharing that IP (e.g. behind office NAT).
        const { ok } = checkRateLimit(`login:${ip}:${normalizedEmail}`, {
          limit: 10,
          windowMs: 10 * 60 * 1000,
        });
        if (!ok) return null;

        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
});
