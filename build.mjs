// 绕过 Vite 的“配置文件打包”步骤（该步骤用 esbuild，会向上遍历到沙箱外被拒目录）。
// 改为直接调用 Vite 的 JS API，传入内联配置。
import { build } from "vite";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url)).replace(/[\\/]$/, "");

await build({
  configFile: false,
  root,
  base: "./",
  esbuild: { jsx: "automatic" },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  logLevel: "info",
});
