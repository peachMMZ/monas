<template>
  <n-tree-select v-model:value="value" :options="menuTree" label-field="name" key-field="id"
    :render-prefix="renderPrefix" />
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue'
import { menuService } from '@/views/system/menu/service'
import type { Menu } from '@/views/system/menu/types'
import { NTreeSelect } from 'naive-ui'
import LucideIcon from '../LucideIcon'

defineOptions({
  name: 'MenuTreeSelect',
})

const value = defineModel<number | null>('value')

const menuTree = ref<Menu[]>([])
function fetchMenuTree() {
  menuService.tree().then((res) => {
    menuTree.value = res.data || []
  })
}

function renderPrefix({ option }: { option: unknown }) {
  const menu = option as Menu
  return h(LucideIcon, { name: menu.icon || '', size: 18 })
}

onMounted(() => {
  fetchMenuTree()
})
</script>
<style scoped></style>
