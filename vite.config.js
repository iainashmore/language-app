import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is set for GitHub Pages project sites (served from /language-app/).
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? '/language-app/' : '/',
})
