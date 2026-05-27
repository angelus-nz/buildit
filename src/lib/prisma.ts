import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { readFileSync } from "fs";
import { join } from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function stripSslMode(raw: string): string {
  try {
    const url = new URL(raw);
    url.searchParams.delete("sslmode");
    return url.toString();
  } catch {
    return raw;
  }
}

function createPrismaClient() {
  const raw = process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL!;
  // pg-connection-string v3+ maps sslmode=require → verify-full, which then
  // overrides any explicit ssl.ca option passed to Pool. Stripping sslmode
  // from the URL lets our explicit ssl config (with the bundled Supabase root
  // CA) be the sole TLS configuration, enabling proper chain verification.
  const connectionString = stripSslMode(raw);
  const ca = readFileSync(
    join(process.cwd(), "certs/supabase-root-ca.pem")
  ).toString();
  const pool = new Pool({ connectionString, ssl: { ca, rejectUnauthorized: true } });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
