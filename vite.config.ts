import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// GitHub Pages deploys to https://<user>.github.io/<repo>/
// Set base to repo name so assets resolve correctly.
export default defineConfig({
  base: "/codenest/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
