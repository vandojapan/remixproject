import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  build: {
    outDir: 'public/build',  // Cloudflare Pagesが期待する出力先
    rollupOptions: {
      input: '/app/entry.client.tsx', // クライアントエントリーポイント
    },
  },
});
