import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  /* Agregar alias para @. $ npm install --save-dev @types/node resuelve
  la importacion de 'path'*/
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
