import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// The base path MUST match your GitHub repository name, e.g. if your repo is
// github.com/yourname/roza-little-class then base should be '/roza-little-class/'.
// This is set via the REPO_NAME environment variable in the GitHub Actions
// workflow (.github/workflows/deploy.yml) so you only have to set it in one place.
const repoName = process.env.REPO_NAME || 'roza-little-class'

export default defineConfig({
  base: `/${repoName}/`,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: "Róża's Little Class",
        short_name: "Little Class",
        description: 'A warm, low-effort home-class planner and learning journal for Róża.',
        theme_color: '#FFF9EF',
        background_color: '#FFF9EF',
        display: 'standalone',
        start_url: `/${repoName}/`,
        scope: `/${repoName}/`,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      }
    })
  ]
})
