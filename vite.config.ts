import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isElectronBuild = process.env.ELECTRON_BUILD === 'true'

export default defineConfig({
  plugins: [react()],
  base: isElectronBuild ? './' : '/businesscard1/',
})
