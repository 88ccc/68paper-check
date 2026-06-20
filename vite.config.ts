import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import fs from 'node:fs'
import path from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    {
      name: 'rename-index-to-php',
      closeBundle() {
        const distPath = path.resolve(__dirname, 'dist')
        
        // 重命名
        fs.renameSync(
          path.join(distPath, 'index.html'),
          path.join(distPath, 'index.php')
        )
        console.log('✅ 已自动将 index.html 重命名为 index.php')
      },
    },
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
