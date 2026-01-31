<template>
  <div class="h-full">
    <n-layout class="h-full" has-sider>
      <n-layout-sider bordered :collapsed="collapsed" :inverted="themeStore.siderInverted" collapse-mode="width"
        :collapsed-width="64">
        <div class="h-full flex flex-col overflow-x-hidden">
          <app-logo class="h-12 app-logo" :collapsed="collapsed" />
          <app-menu :collapsed="collapsed" />
        </div>
      </n-layout-sider>
      <n-layout class="h-full" content-class="h-full">
        <n-layout-header class="h-12" bordered>
          <app-header @collapse="collapsed = $event" />
        </n-layout-header>
        <n-layout-content class="h-[calc(100%-3rem)]">
          <div class="h-full flex flex-col overflow-hidden">
            <app-tab />
            <div class="flex-1 p-1 overflow-auto">
              <router-view #default="{ Component }">
                <transition name="page" mode="out-in">
                  <keep-alive :include="menuStore.keepAliveRoutes">
                    <component :is="Component" />
                  </keep-alive>
                </transition>
              </router-view>
            </div>
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>
    <app-theme-drawer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NLayout, NLayoutSider, NLayoutHeader, NLayoutContent } from 'naive-ui'
import AppLogo from '@/layout/AppLogo.vue'
import AppMenu from '@/layout/AppMenu.vue'
import AppHeader from '@/layout/AppHeader.vue'
import AppTab from '@/layout/AppTab.vue'
import AppThemeDrawer from '@/layout/AppThemeDrawer.vue'
import { useThemeStore } from '@/stores/theme'
import { useMenuStore } from '@/stores/menu'

const themeStore = useThemeStore()
const menuStore = useMenuStore()

const collapsed = ref(false)
</script>
<style scoped>
.app-logo {
  border-bottom: 1px solid var(--n-border-color);
}

.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    filter 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, opacity, filter;
}

.page-enter-from {
  opacity: 0;
  transform:
    perspective(1200px) translateY(18px) scale(0.96);
  filter: blur(4px);
}

.page-leave-to {
  opacity: 0;
  transform:
    perspective(1200px) translateY(-12px) scale(1.02);
  filter: blur(2px);
}
</style>
