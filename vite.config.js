import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Peoples_Physio/',
  plugins: [react()],
  server: {
    port: 3000
  }
})
