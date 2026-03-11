import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/math4ai/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('mafs')) return 'vendor-mafs'
            if (id.includes('recharts') || id.includes('d3')) return 'vendor-charts'
            if (id.includes('framer-motion')) return 'vendor-motion'
            if (id.includes('katex')) return 'vendor-katex'
            if (id.includes('react-router')) return 'vendor-router'
            return 'vendor'
          }
          const subjectMatch = id.match(/subjects\/([\d]+-[^/]+)/)
          if (subjectMatch) return `subject-${subjectMatch[1]}`
        }
      }
    }
  }
})
