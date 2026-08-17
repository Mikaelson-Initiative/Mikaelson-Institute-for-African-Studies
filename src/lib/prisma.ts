import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Prisma 7 requires an explicit driver adapter. DATABASE_URL must be a real
// Postgres connection string (Neon/Supabase/Railway/etc.) — see .env.example.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(
      new Pool({ 
        connectionString: process.env.DATABASE_URL?.replace("sslmode=require", "sslmode=require&uselibpqcompat=true") 
      })
    ),
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
