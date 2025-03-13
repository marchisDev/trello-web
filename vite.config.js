import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    // cho phep Vite su dung duoc process.env, mac dinh thi Vite khong ho tro, mac dinh dung import.meta.env
    'process.env': process.env
  },
  plugins: [react(), svgr()],
  // base: './'
  resolve: {
    alias: [{ find: '~', replacement: '/src' }]
  }
})
