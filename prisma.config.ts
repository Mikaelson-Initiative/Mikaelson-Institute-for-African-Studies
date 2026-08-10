import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7 moved the datasource URL out of schema.prisma and into config.
// See prisma/schema.prisma for the note on swapping this for Postgres later.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
