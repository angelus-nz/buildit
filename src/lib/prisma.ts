import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { join } from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function buildConnectionString(): string {
  const raw = process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL!;
  try {
    const url = new URL(raw);
    // Use verify-full with the bundled Supabase root CA so pg performs full
    // certificate chain verification. sslrootcert path is absolute so it
    // resolves correctly inside Vercel's /var/task deployment root.
    url.searchParams.set("sslmode", "verify-full");
    url.searchParams.set(
      "sslrootcert",
      join(process.cwd(), "certs/supabase-root-ca.pem")
    );
    return url.toString();
  } catch {
    return raw;
  }
}

function createPrismaClient() {
  const pool = new Pool({ connectionString: buildConnectionString() });
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
