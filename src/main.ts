import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createDiscreteApi } from 'naive-ui'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './style/main.css'

import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/theme'

async function setup() {
  const start = Date.now()

  const app = createApp(App)
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  app.use(pinia)
  app.use(router)

  app.mount('#app')

  const { loadingBar } = createDiscreteApi(['loadingBar'], {
    configProviderProps: {
      themeOverrides: useThemeStore().themeOverride,
    },
  })
  router.beforeEach(() => loadingBar.start())
  router.onError(() => loadingBar.error())
  router.afterEach(() => loadingBar.finish())

  console.log(`App mounted in ${Date.now() - start}ms`)
}

setup()
