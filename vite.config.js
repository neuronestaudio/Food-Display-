import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // La Villa runs on its own fixed port (registry: Camera 5173, Cave 5175,
  // Seed 5177, Ferrari 5178, Aura 5179) so it never collides with the others.
  server: { port: 5180, strictPort: true },
  preview: { port: 5180, strictPort: true },
})
