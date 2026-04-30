import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({ jsxRuntime: "automatic" }), tailwindcss()],
  server: {
    proxy: {
      // Proxy configuration
      "/api": {
        target: process.env.VITE_API_URI, // Your backend server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
