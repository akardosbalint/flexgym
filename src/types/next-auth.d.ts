import type { DefaultSession } from "next-auth";

type UserRole = "MEMBER" | "STAFF";

declare module "next-auth" {
  interface User {
    role?: UserRole;
  }

  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
    role?: UserRole;
  }
}
