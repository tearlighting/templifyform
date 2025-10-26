import path from "path"
import IconsResolver from "unplugin-icons/resolver"
import Icons from "unplugin-icons/vite"
import Components from "unplugin-vue-components/vite"
import { defineConfig } from "vite"

import react from "@vitejs/plugin-react"
import vue from "@vitejs/plugin-vue"

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/templify-form/" : "/",
  plugins: [
    vue(),
    react({
      jsxImportSource: "react",
      include: /\.(jsx|tsx)$/, // 确保 .tsx 被 React 编译
    }),
    Components({
      resolvers: [
        // 自动识别 <i-xxx-yyy /> 为图标组件
        IconsResolver({
          prefix: "i", // 默认就是 i，可以改成 icon 之类的
        }),
      ],
    }),
    Icons({
      autoInstall: true, // 自动下载对应图标库，不用手动 import
    }),
  ],
  resolve: {
    alias: {
      "@": "/src",
      "templify-form": path.resolve(__dirname, "../../lib"),
      "#": path.resolve(__dirname, "../../lib"),
      react: require.resolve("react"),
      "react-dom": require.resolve("react-dom"),
    },
  },
  esbuild: { jsx: "automatic", jsxImportSource: "react" },
  //   server: {
  //     proxy: {
  //       // 将本地开发访问的 /templify-form 映射到根路径

  //       // 仅在 dev 时代理掉 /templify-form
  //       "^/templify-form/.*": {
  //         target: "http://127.0.0.1:5173", // 一定要用 127.0.0.1，不要用 localhost
  //         rewrite: (path) => path.replace(/^\/templify-form/, ""),
  //         changeOrigin: false,
  //       },
  //     },
  //   },
}))
