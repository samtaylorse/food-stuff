import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          environment: "node",
          include: ["tests/unit/**/*.test.{ts,mts,js,mjs}"],
          exclude: ["tests/browser/**"],
        },
      },
      {
        test: {
          name: "integration",
          environment: "node",
          include: ["tests/integration/**/*.test.{ts,mts,js,mjs}"],
          exclude: ["tests/browser/**"],
          fileParallelism: false,
        },
      },
    ],
  },
});
