

## Plan: Transform BSM Transport into a PWA compatible with PWABuilder

### Overview
Install `vite-plugin-pwa` and configure it to generate the manifest, service worker, and all PWA metadata automatically. This is the recommended approach for Vite projects — it handles caching, offline support, and manifest generation without manual service worker files.

### Changes

**1. Install `vite-plugin-pwa`**

**2. Update `vite.config.ts`**
- Import and configure `VitePWA` plugin with:
  - `name`: "BSM Transport - Gestão Financeira"
  - `short_name`: "BSM Transport"
  - `start_url`: "/"
  - `display`: "standalone"
  - `background_color`: "#121212" (matches dark theme)
  - `theme_color`: "#00FFFF" (cyan neon primary)
  - `orientation`: "portrait"
  - `icons`: All 9 sizes (48, 72, 96, 128, 144, 152, 192, 384, 512) referencing placeholder PNGs in `/public/pwa-icons/`
  - `navigateFallbackDenylist`: `[/^\/~oauth/]` (required for OAuth)
- Workbox runtime caching strategy for offline support

**3. Generate placeholder icon PNGs**
- Create simple SVG-based placeholder icons at all required sizes in `public/pwa-icons/` that the user can replace with their logo

**4. Update `index.html`**
- Add `<meta name="theme-color">` and Apple-specific meta tags
- Add `<link rel="apple-touch-icon">`

**5. Update `src/main.tsx`**
- Register the service worker via `vite-plugin-pwa/register`

### Result
- Fully PWABuilder-compatible manifest with all required fields
- Service worker with offline caching (Workbox via vite-plugin-pwa)
- Placeholder icons at all 9 sizes ready to be swapped with the real logo
- Installable from browser on mobile and desktop

