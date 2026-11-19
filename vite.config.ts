import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  server: { host: "127.0.0.1", port: 3000 },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    // Builds a standalone Node server in .output/ (run with `npm start`).
    nitro({ preset: "node-server" }),
    viteReact(),
  ],
});
