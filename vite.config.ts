import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Modo "usb": un solo archivo HTML que funciona con doble clic (file://), sin service worker.
export default defineConfig(({ mode }) => {
  const usb = mode === 'usb';
  return {
    base: usb ? './' : '/',
    plugins: [
      react(),
      tailwindcss(),
      ...(usb
        ? [viteSingleFile()]
        : [
            VitePWA({
              registerType: 'autoUpdate',
              includeAssets: ['logo_lmn.png', 'icon-192.png', 'icon-512.png'],
              manifest: {
                name: 'Taller Web TIC',
                short_name: 'Taller TIC',
                description: 'Crea tu página web y descubre el código que hay detrás',
                lang: 'es-MX',
                theme_color: '#001F34',
                background_color: '#001F34',
                display: 'standalone',
                start_url: '/',
                icons: [
                  { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
                  { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
                ],
              },
              workbox: {
                globPatterns: ['**/*.{js,css,html,woff2,woff,png,svg,ico}'],
                navigateFallback: 'index.html',
                maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
              },
            }),
          ]),
    ],
    build: {
      outDir: usb ? 'dist-usb' : 'dist',
      ...(usb ? { assetsInlineLimit: 100000000, cssCodeSplit: false } : {}),
    },
    test: { environment: 'node', include: ['src/**/*.test.ts'] },
  };
});
