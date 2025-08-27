import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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
    },
  },
});
