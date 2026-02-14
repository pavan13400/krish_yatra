import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon2.jpg"],
      manifest: {
        name: "KrishiYantra – Smart Farming Machinery",
        short_name: "KrishiYantra",
        description: "AI-powered machinery recommendations for Indian farmers. Book slots instantly.",
        theme_color: "#2d7a3e",
        background_color: "#f7f6f1",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "/favicon2.jpg", sizes: "192x192", type: "image/jpeg", purpose: "any maskable" },
          { src: "/favicon2.jpg", sizes: "512x512", type: "image/jpeg", purpose: "any maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,svg,woff2}"],
        runtimeCaching: [
          { urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/i, handler: "CacheFirst", options: { cacheName: "images", expiration: { maxEntries: 50 } } },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
