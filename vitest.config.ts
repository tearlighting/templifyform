import { defineConfig } from "vitest/config"
import path from "path"
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8", // 可选：想看覆盖率报告
      reporter: ["text", "html"],
    },
  },
  resolve: {
    alias: {
      "#": path.resolve(__dirname, "lib"),
    },
  },
})
