import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './style/main.css'

import App from './App.vue'
import router from './router'

async function setup() {
  const start = Date.now()

  const app = createApp(App)
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  app.use(pinia)
  app.use(router)

  app.mount('#app')
  console.log(`App mounted in ${Date.now() - start}ms`)
}

setup()
