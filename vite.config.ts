import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { ServerResponse } from 'node:http'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [vue(), vueDevTools({ launchEditor: 'trae' }), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 9300,
      proxy: {
        [env.VITE_API_BASE_URL]: {
          target: env.VITE_API_PROXY_TARGET,
          changeOrigin: true,
          rewrite: (path) => path.replace(new RegExp(`^${env.VITE_API_BASE_URL}`), ''),
          configure: (proxy) => {
            proxy.on('error', (err, _req, res) => {
              console.log('[proxy error]', err)
              if (res instanceof ServerResponse) {
                res.writeHead(502, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ code: 502, msg: '无法访问服务' }))
              }
            })
          },
        },
      },
    },
  }
})
