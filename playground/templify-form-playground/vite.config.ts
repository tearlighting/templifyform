import path from 'path';
import IconsResolver from 'unplugin-icons/resolver';
import Icons from 'unplugin-icons/vite';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    react(),
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
    },
  },
})
