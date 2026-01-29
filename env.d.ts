/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_PROXY_TARGET: string
  // 指定DevTools插件打开的编辑器
  readonly VITE_DEV_TOOLS_LAUNCH_EDITOR?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
