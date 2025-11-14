<template>
  <div class="flex gap-x-1 h-full">
    <div class="w-1/3 h-full">
      <n-card class="h-full">
        <template #header>
          <div class="flex justify-between items-center">
            <span>菜单列表</span>
          </div>
        </template>
        <template #header-extra>
          <div class="flex gap-x-2">
            <n-button type="primary" size="small" quaternary :render-icon="renderIcon(Plus)" @click="add">新增</n-button>
            <n-button type="error" size="small" quaternary :render-icon="renderIcon(Trash2)" :disabled="!currentMenuId"
              @click="remove">删除</n-button>
          </div>
        </template>
        <div class="mb-2">
          <n-input v-model:value="searchText" size="small" clearable placeholder="搜索菜单" />
        </div>
        <n-tree v-model:selected-keys="selectedKeys" :data="treeData" block-line key-field="id" label-field="name"
          show-line :render-prefix="renderPrefix" :render-suffix="renderSuffix" :pattern="searchText" />
      </n-card>
    </div>
    <div class="flex-1 h-full">
      <div class="flex justify-center items-center h-full">
        <save-card v-if="currentMenuId || addMode" :menu-id="currentMenuId" @success="handleSuccess" />
        <n-card v-else class="h-full" content-class="flex items-center justify-center">
          <n-empty description="请选择菜单" size="huge" />
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h, computed } from 'vue'
import { NCard, NButton, NInput, NTree, NEmpty, NText, useModal, useMessage } from 'naive-ui'
import SaveCard from './components/SaveCard.vue'
import { menuService } from './service'
import type { Menu } from './types'
import { Plus, Trash2 } from 'lucide-vue-next'
import LucideIcon from '@/components/LucideIcon'
import { renderIcon } from '@/utils/renderer'

defineOptions({
  name: 'MenuView',
})

const modal = useModal()
const message = useMessage()

const treeData = ref<Menu[]>([])
function fetchData() {
  menuService.tree().then((res) => {
    treeData.value = res.data || []
  })
}
const selectedKeys = ref<string[]>([])
const currentMenuId = computed(() => {
  if (selectedKeys.value.length === 1) {
    return Number(selectedKeys.value[0])
  } else {
    return undefined
  }
})

const addMode = ref<boolean>(false)
function add() {
  addMode.value = !addMode.value
  if (addMode.value) {
    selectedKeys.value = []
  }
}
function remove() {
  if (!currentMenuId.value) {
    return
  }
  modal.create({
    title: '确认删除',
    content: '确认删除选中的菜单吗？',
    preset: 'confirm',
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick: () => {
      menuService.delete({ id: currentMenuId.value }).then(() => {
        message.success('删除成功')
        handleSuccess()
        selectedKeys.value = []
      })
    },
  })
}

function handleSuccess() {
  addMode.value = false
  fetchData()
}

function renderPrefix({ option }: { option: unknown }) {
  const menu = option as Menu
  if (!menu.icon) {
    return ''
  }
  return h(LucideIcon, { name: menu.icon, class: 'w-4 h-4' })
}

function renderSuffix({ option }: { option: unknown }) {
  const menu = option as Menu
  return h(NText, { type: 'primary' }, { default: () => menu.path })
}

const searchText = ref()

onMounted(() => {
  fetchData()
})
</script>
<style scoped></style>
