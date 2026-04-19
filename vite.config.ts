import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative base so asset paths work inside the Capacitor Android WebView (file://).
  base: './',
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['react-simple-maps', 'prop-types', 'd3-geo', 'topojson-client'],
  },
  server: {
    host: true,
    allowedHosts: true,
  },
})
