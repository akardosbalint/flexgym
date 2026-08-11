import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migrations (and other CLI commands) need a direct, non-pooled
    // connection - Supabase's connection pooler (PgBouncer, transaction
    // mode) doesn't support the advisory lock `prisma migrate deploy`
    // takes, which makes it hang forever instead of failing. Falls back to
    // DATABASE_URL for local dev, where there's no pooler in front of it.
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
