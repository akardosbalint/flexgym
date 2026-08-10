import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  if (!req.auth) {
    const isAdminPath = req.nextUrl.pathname.startsWith("/admin");
    const signInUrl = new URL(isAdminPath ? "/beleptetes" : "/bejelentkezes", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (req.nextUrl.pathname.startsWith("/admin") && req.auth.user.role !== "STAFF") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
