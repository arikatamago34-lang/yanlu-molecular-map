// 使用 CommonJS 配置文件，避免 Vite 用 esbuild 打包配置时
// 向上遍历到沙箱之外、无法枚举的目录。
module.exports = {
  base: "./",
  esbuild: {
    jsx: "automatic",
  },
  build: {
    outDir: "dist",
  },
};
