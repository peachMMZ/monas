<template>
  <n-menu :value="menuStore.current" class="h-full" :inverted="themeStore.siderInverted" :options="options"
    :collapsed="collapsed" :collapsed-width="64" @update:value="menuStore.onMenuSelect" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { renderIcon, renderMenuLabel } from '@/utils/renderer'
import { Menu as MenuIcon } from 'lucide-vue-next'
import { NMenu, type MenuOption } from 'naive-ui'
import { useThemeStore } from '@/stores/theme'
import { useMenuStore } from '@/stores/menu'
import type { Menu } from '@/views/system/menu/types'

defineProps<{
  collapsed?: boolean
}>()

const menuStore = useMenuStore()
const themeStore = useThemeStore()

const options = computed(() => {
  return menuStore.menus.map(menuToOptions)
})

function menuToOptions(menu: Menu): MenuOption {
  return {
    label: renderMenuLabel(menu),
    key: menu.path,
    icon: renderIcon(menu.icon || MenuIcon),
    children: menu.children?.map(menuToOptions) || undefined,
  }
}
</script>
<style scoped></style>
