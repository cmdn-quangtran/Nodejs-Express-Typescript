import * as esbuild from "esbuild";

await esbuild.build({
  bundle: true,
  entryPoints: ["./src/handler/api/app.ts"],
  outdir: "./dist",
  outExtension: {
    ".js": ".mjs",
  },
  platform: "node",
  format: "esm",
  banner: {
    // Solution for potential issues that may arise when bundling commonjs libraries in an ESM project
    js: 'import { createRequire } from "module"; import url from "url"; const require = createRequire(import.meta.url); const __filename = url.fileURLToPath(import.meta.url); const __dirname = url.fileURLToPath(new URL(".", import.meta.url));',
  },
  sourcemap: true,
  external: ["sharp"],
});
