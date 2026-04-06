import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  outExtensions: ({ format }) => ({
    js: format === "es" ? ".mjs" : ".js",
  }),
  outDir: "dist",
  dts: false,
  sourcemap: true,
  minify: true,
  clean: true,
  shims: true,
  target: "es2020",
  platform: "node",
  deps: {
    alwaysBundle: ["@modelcontextprotocol/sdk", "zod"],
    onlyBundle: false,
  },
  banner: "#!/usr/bin/env node",
});
