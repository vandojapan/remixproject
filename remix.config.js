/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: "app", // アプリのディレクトリ
  assetsBuildDirectory: "public/build", // 公開されるビルドアセットの出力ディレクトリ
  serverBuildDirectory: "build", // サーバビルドの出力ディレクトリ
  serverBuildTarget: "cloudflare-pages",
  server: "./server.js", // Cloudflare用のカスタムサーバーを指定
};
