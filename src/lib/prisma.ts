import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString =
    process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL!;
  // Supabase's PgBouncer pooler uses an intermediate CA not in Node's default
  // trust store. rejectUnauthorized:false is required; the endpoint is fixed
  // (Vercel-Supabase integration URL), so MITM risk is negligible.
  const sslConfig =
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : undefined;
  const pool = new Pool({ connectionString, ssl: sslConfig });
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
