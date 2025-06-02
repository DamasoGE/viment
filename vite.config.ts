import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['viment.duckdns.org'],
    host: true,
    port: 80,
  }
})