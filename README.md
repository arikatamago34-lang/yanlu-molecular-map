# 研路分子图谱（静态版）

由 UN1 发起并开源、联合 OpenAI Codex 辅助构建的生命科学 3D 分子网络。

本目录是原 Vinext / Cloudflare Worker 版本的**纯 Vite + React 静态迁移版**：已移除服务器组件、Worker、Drizzle 数据库与 ChatGPT 登录依赖，保留全部 3D 图谱、分子聚焦、过程平面、抽屉详情、全屏、字号、语言切换、分享与源码下载功能。构建产物为纯静态文件，不含任何境外 CDN、网络字体或 API，可在离线或中国大陆网络下稳定打开。

## 环境

- Node.js 22 或更高版本（推荐 24）

## 安装与构建

```bash
npm install
npm run build
```

构建产物输出到 `dist/`。直接双击 `dist/index.html` 即可本地打开，或把整个 `dist/` 目录上传到任意静态托管平台。

> 说明：`npm run build`（走 `vite.config.cjs`）与 `node build.mjs`（直接用 Vite 的 JS API）等效，二者都会产出 `dist/`。原构建链依赖 OpenAI 私有的 Vinext/Worker 环境，本版本已改为纯 Vite + React 静态构建。

## 目录

- `src/Home.tsx` 页面入口（由原 `page.tsx` 迁移）
- `src/Universe.tsx` 3D 分子宇宙（Canvas 自定义 3D 投影）
- `src/ShareButton.tsx` 分享与源码下载
- `src/*.ts` 生化 / 细胞 / 分子图谱数据
- `src/globals.css` 全部样式（纯 CSS，无外部引用）
- `public/` 静态资产（og.png、favicon.svg、LICENSE.md、开源许可、源码包）

## 许可与署名

- 源代码：MIT License
- UN1 原创知识内容与视觉设计：CC BY 4.0
- 使用、修改与分享请保留“UN1”署名。
