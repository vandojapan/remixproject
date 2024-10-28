import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
    tsconfigPaths(),
  ],
  build: {
    outDir: 'public/build', // Cloudflare Pagesが期待する出力先
    rollupOptions: {
      input: '/app/entry.client.tsx', // クライアントエントリーポイント
    },
  },
  server: {
    fs: {
      allow: ['.'], // ローカルファイルシステムからの読み込みを許可
    },
  },
});
