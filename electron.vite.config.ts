import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@engine': resolve('src/engine'),
        '@adaptor': resolve('src/adaptor'),
        '@earendil-works/pi-ai': resolve('node_modules/@earendil-works/pi-ai/dist/index.js')
      }
    },
    build: {
      externalizeDeps: {
        exclude: ['@earendil-works/pi-ai']
      }
    }
  },
  preload: {
    build: {
      externalizeDeps: true
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@engine': resolve('src/engine'),
        '@adaptor': resolve('src/adaptor')
      }
    },
    plugins: [tailwindcss(), react()]
  }
})
