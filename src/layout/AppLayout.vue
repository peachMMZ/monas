<template>
  <div class="h-full">
    <n-layout class="h-full" has-sider>
      <n-layout-sider bordered :collapsed="collapsed" collapse-mode="width" :collapsed-width="64">
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
              <router-view />
            </div>
          </div>
        </n-layout-content>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NLayout, NLayoutSider, NLayoutHeader, NLayoutContent } from 'naive-ui'
import AppLogo from '@/layout/AppLogo.vue'
import AppMenu from '@/layout/AppMenu.vue'
import AppHeader from '@/layout/AppHeader.vue'
import AppTab from '@/layout/AppTab.vue'

const collapsed = ref(false)
</script>
<style scoped>
.app-logo {
  border-bottom: 1px solid var(--n-border-color);
}
</style>
