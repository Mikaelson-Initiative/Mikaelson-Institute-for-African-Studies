import "dotenv/config";
import { defineConfig } from "prisma/config";

// Prisma 7 moved the datasource URL out of schema.prisma and into config.
// See prisma/schema.prisma for the note on swapping this for Postgres later.
//
// Deliberately not using the `env()` helper from prisma/config: it throws
// synchronously the moment DATABASE_URL is unset, which breaks `prisma
// generate` itself (e.g. on Vercel's build step, before any real database is
// provisioned) even though generate never needs a live connection.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  },
});
