/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: "cloudflare-pages", // これを確認・設定
  assetsBuildDirectory: "public/build", // Cloudflareが読むことができるディレクトリに変更
  publicPath: "/build/",
  serverBuildPath: "build/server.js",
};
