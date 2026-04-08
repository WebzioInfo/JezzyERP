import { defineConfig } from "@trigger.dev/sdk/v3";
import { prismaExtension } from "@trigger.dev/build/extensions/prisma";

export default defineConfig({
  project: "jezzy-erp",
  dirs: ["./src/trigger"],
  maxDuration: 3600,
  build: {
    extensions: [prismaExtension({ mode: "legacy", schema: "prisma/schema.prisma" })],
  },
});
