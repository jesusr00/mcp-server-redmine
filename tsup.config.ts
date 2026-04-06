import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  outExtension({ format }) {
    return {
      js: format === "esm" ? ".mjs" : ".js",
    };
  },
  outDir: "dist",
  dts: false,
  sourcemap: true,
  minify: true,
  clean: true,
  splitting: true,
  external: [],
  shims: true,
  tsconfig: "tsconfig.json",
  noExternal: [/@modelcontextprotocol/, /zod/],
  banner: {
    js: "#!/usr/bin/env node",
  },
  esbuildOptions(options) {
    options.target = ["es2020"];
    options.alias = {
      "@modelcontextprotocol/sdk/server/mcp": "@modelcontextprotocol/sdk/server/mcp.js",
      "@modelcontextprotocol/sdk/server/stdio": "@modelcontextprotocol/sdk/server/stdio.js",
    };
  },
});
