import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import modules from './modules';

const alias: { [key: string]: string } = {}

modules.forEach(module => {
  alias[module] = path.resolve(__dirname, `src/modules/${module}`)
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias
  }
})
