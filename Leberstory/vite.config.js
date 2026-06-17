import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const base =
  process.env.VITE_BASE_PATH ??
  (process.env.NODE_ENV === "development" ? "/" : "./");

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
    dedupe: ["react", "react-dom"],
  },
});
