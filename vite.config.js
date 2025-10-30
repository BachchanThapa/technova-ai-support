import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // your existing hook
      '@chatapp/usechat': fileURLToPath(
        new URL('./packages/core/hooks/usechat', import.meta.url)
      ),

      // pages
      '@chatapp/chatpage': fileURLToPath(
        new URL('./packages/pages/chatpage', import.meta.url)
      ),

      // base components
      '@chatapp/chat': fileURLToPath(
        new URL('./packages/base/chat', import.meta.url)
      ),
      '@chatapp/message': fileURLToPath(
        new URL('./packages/base/message', import.meta.url)
      ),
      '@chatapp/loading': fileURLToPath(
        new URL('./packages/base/loading', import.meta.url)
      ),
    },
  },
  server: {
    proxy: {
      '/rag/chat': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
})
