<template>
  <div class="w-full flex justify-between">
    <div class="w-[calc(100%-3rem)]">
      <n-tabs :value="menuStore.current" type="card" size="small" :tabs-padding="4" @update:value="$router.push"
        @close="menuStore.removeTab">
        <n-tab name="/home">首页</n-tab>
        <n-tab v-for="tab in menuStore.tabs" closable :key="tab.path" :name="tab.path">{{
          tab.label
        }}</n-tab>
      </n-tabs>
    </div>
    <div class="w-12 flex justify-center items-center" :style="{ borderLeft: `1px solid ${themeVars.borderColor}` }">
      <n-dropdown :options="options" size="small" @select="onDropdownSelect">
        <n-button text size="small" :render-icon="renderIcon(MoreHorizontal)"></n-button>
      </n-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NTabs, NTab, NButton, NDropdown, useThemeVars } from 'naive-ui'
import { MoreHorizontal, CircleX, SquareX, Clock } from 'lucide-vue-next'
import { renderIcon } from '@/utils/renderer'
import { useMenuStore } from '@/stores/menu'

const themeVars = useThemeVars()
const menuStore = useMenuStore()

const options = [
  {
    key: 'close-all',
    label: '关闭所有',
    icon: renderIcon(CircleX, { color: themeVars.value.errorColor }),
  },
  {
    key: 'close-other',
    label: '关闭其他',
    icon: renderIcon(SquareX, { color: themeVars.value.warningColor }),
  },
  { type: 'divider' },
  {
    key: 'recently',
    label: '最近打开',
    icon: renderIcon(Clock, { color: themeVars.value.successColor }),
  },
]

function onDropdownSelect(key: string) {
  if (key === 'close-all') {
    menuStore.removeAllTabs()
  } else if (key === 'close-other') {
    menuStore.removeOtherTabs(menuStore.current)
  }
}
</script>
<style scoped>
:deep(.n-tabs-tab) {
  margin-top: 4px;
}
</style>
