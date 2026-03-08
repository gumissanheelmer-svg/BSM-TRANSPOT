import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

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
      includeAssets: ["favicon.ico", "robots.txt", "pwa-icons/*.png"],
      manifest: {
        name: "BSM Transport - Gestão Financeira",
        short_name: "BSM Transport",
        description: "Sistema de gestão financeira para empresas de transporte.",
        start_url: "/",
        display: "standalone",
        background_color: "#121212",
        theme_color: "#00FFFF",
        orientation: "portrait",
        icons: [
          { src: "/pwa-icons/icon-48x48.png", sizes: "48x48", type: "image/png" },
          { src: "/pwa-icons/icon-72x72.png", sizes: "72x72", type: "image/png" },
          { src: "/pwa-icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
          { src: "/pwa-icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
          { src: "/pwa-icons/icon-144x144.png", sizes: "144x144", type: "image/png" },
          { src: "/pwa-icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
          { src: "/pwa-icons/icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/pwa-icons/icon-384x384.png", sizes: "384x384", type: "image/png", purpose: "any" },
          { src: "/pwa-icons/icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/~oauth/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
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
