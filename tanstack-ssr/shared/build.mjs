// Simple build script — transpiles shared.ts to dist/shared.js using esbuild.
// esbuild is available as a transitive dep via vite.
import { build } from "esbuild";
import { mkdirSync } from "fs";

mkdirSync("dist", { recursive: true });
await build({
  entryPoints: ["shared.ts"],
  outfile: "dist/shared.js",
  bundle: true,
  format: "esm",
  platform: "neutral",
  external: ["react"],
});
console.log("tanstack-ssr-shared built");
