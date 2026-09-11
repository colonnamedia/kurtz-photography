import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // During `npm run dev`, proxy API calls to `vercel dev` (port 3000)
      '/api': 'http://localhost:3000',
    },
  },
})
