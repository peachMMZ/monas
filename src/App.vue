<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme="naiveTheme"
    :theme-overrides="themeStore.themeOverride">
    <n-global-style />
    <n-message-provider>
      <n-modal-provider>
        <n-loading-bar-provider>
          <div class="h-screen">
            <router-view />
          </div>
        </n-loading-bar-provider>
      </n-modal-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import {
  NConfigProvider,
  NGlobalStyle,
  NMessageProvider,
  NModalProvider,
  NLoadingBarProvider,
  zhCN,
  dateZhCN,
  lightTheme,
  darkTheme
} from 'naive-ui'
import { useMenuStore } from '@/stores/menu'
import { useThemeStore } from '@/stores/theme'

const menuStore = useMenuStore()
const themeStore = useThemeStore()

const naiveTheme = computed(() => (themeStore.theme === 'dark' ? darkTheme : lightTheme))

onMounted(async () => {
  await menuStore.init()
  await themeStore.init()
})
</script>

<style scoped></style>
