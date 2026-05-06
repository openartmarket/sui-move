import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		// We can't run tests in parallel
		fileParallelism: false,
	},
});
