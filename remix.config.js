/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverBuildTarget: "cloudflare-pages",
  appDirectory: "app",
  assetsBuildDirectory: "build/client",
  publicPath: "/build/client/",
  serverBuildPath: "build/server.js",
};
