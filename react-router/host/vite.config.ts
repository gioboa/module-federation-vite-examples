import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

// No federation plugin here: remotes are only known at runtime, so the host
// creates its Module Federation instances itself, see app/mf/load-remote.ts.
export default defineConfig({
  plugins: [reactRouter()],
  build: {
    target: "chrome89",
  },
  server: {
    port: 4173,
  },
});
