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
    root: 'src', // ソースディレクトリを指定（必要に応じて変更）
    build: {
      outDir: '../build', // ビルド出力先を指定
      rollupOptions: {
        input: 'src/index.html', // HTMLエントリーポイントを指定
      },
    },
  server: {
    fs: {
      allow: ['.'], // ローカルファイルシステムからの読み込みを許可
    },
  },
});
