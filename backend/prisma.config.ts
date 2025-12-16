import "dotenv/config";  // ← Add this at the top
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  
  migrations: {
    path: "prisma/migrations",
  },
  
  datasource: {
    url: env("DATABASE_URL"),
    shadowDatabaseUrl: env("SHADOW_DATABASE_URL"),  // Optional
  },
});
