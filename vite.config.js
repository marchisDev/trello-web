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
  base: '/', // Đảm bảo base path đúng
  server: {
    historyApiFallback: true // Giúp xử lý route đúng trên local (nếu cần)
  },
  resolve: {
    alias: [{ find: '~', replacement: '/src' }]
  },
  build: {
    outDir: 'dist', // Vercel cần output vào thư mục này
    assetsDir: 'assets', // Chỉ định thư mục chứa assets
    emptyOutDir: true // Xóa thư mục cũ trước khi build lại
  }
})
