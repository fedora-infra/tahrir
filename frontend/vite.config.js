import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["badges.gridhead.net"],
    proxy: {
      "/badge": {
        target: "https://badges.tinystage.test",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/badge/, "/badge"),
      },
      "/json": {
        target: "https://badges.tinystage.test",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/json/, "/json"),
      },
      "/api": {
        target: "https://badges.tinystage.test",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
      "/pngs": {
        target: "http://localhost:9999",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/pngs/, "/pngs"),
      },
    },
  },
});
