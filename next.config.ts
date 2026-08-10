import type { NextConfig } from "next";

// Stripe Checkout redirects the browser away and back; the QR scanner needs
// camera access on the /admin route; the optional GA4 snippet needs one
// inline init script (there's no static-export nonce plumbing here, so
// 'unsafe-inline' stays for script-src - 'unsafe-eval' is dev/Turbopack-HMR
// only and is dropped in production). Everything else is locked down.
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV !== "production" ? "'unsafe-eval'" : ""} https://www.googletagmanager.com https://va.vercel-scripts.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.stripe.com https://www.google-analytics.com https://vitals.vercel-insights.com",
  "frame-src 'self' https://checkout.stripe.com",
  "form-action 'self' https://checkout.stripe.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
]
  .map((d) => d.replace(/\s+/g, " ").trim())
  .join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(self), geolocation=(), microphone=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
