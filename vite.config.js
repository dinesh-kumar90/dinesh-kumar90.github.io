import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/dinesh-kumar90.github.io/',
  build: {
    outDir: 'build'
  },
  plugins: [react()]
});
