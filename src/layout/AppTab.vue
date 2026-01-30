<template>
  <div class="w-full flex justify-between">
    <div class="w-full">
      <n-tabs :value="menuStore.current" type="card" size="small" :tabs-padding="4" @update:value="$router.push"
        @close="menuStore.removeTab">
        <n-tab name="/home">首页</n-tab>
        <n-tab v-for="tab in menuStore.tabs" closable :key="tab.path" :name="tab.path">
          <n-icon v-if="tab.icon">
            <lucide-icon v-if="typeof tab.icon === 'string'" :name="tab.icon" />
            <template v-else>
              <component :is="tab.icon" />
            </template>
          </n-icon>
          <span>{{ tab.label }}</span>
        </n-tab>
        <template #suffix>
          <div class="pr-2">
            <n-dropdown :options="options" size="small" @select="onDropdownSelect">
              <n-button type="primary" quaternary size="small" :render-icon="renderIcon(CircleChevronDown)"></n-button>
            </n-dropdown>
          </div>
        </template>
      </n-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NTabs, NTab, NButton, NDropdown, NIcon, useThemeVars } from 'naive-ui'
import { CircleChevronDown, CircleX, SquareX, Clock } from 'lucide-vue-next'
import { renderIcon } from '@/utils/renderer'
import { useMenuStore } from '@/stores/menu'
import LucideIcon from '@/components/LucideIcon'

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
