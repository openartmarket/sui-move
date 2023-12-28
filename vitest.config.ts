import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // We can't run tests in parallel
    pool: 'threads',
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 1,
      },
    },
  },
});
