import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        embed: "src/embed.tsx"
      },
      output: {
        entryFileNames: (chunkInfo) =>
          chunkInfo.name === "embed" ? "embed.js" : "assets/[name]-[hash].js"
      }
    }
  }
});
