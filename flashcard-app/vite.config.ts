import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/flashcards/',
  build: {
    outDir: path.resolve(__dirname, '../website/public/flashcards'),
    emptyOutDir: true,
  },
})
