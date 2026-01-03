<template>
  <div>
    <n-modal v-model:show="show" title="保存" preset="card" draggable style="width: 25%;">
      <div v-if="role">
        <n-tree v-model:checked-keys="role.menuIds" checkable :selectable="false" :data="treeData" key-field="id"
          label-field="name" block-line show-line :render-prefix="renderPrefix" :render-suffix="renderSuffix"
          :pattern="searchText" virtual-scroll style="height: 480px;" />
      </div>
      <template #action>
        <div class="flex justify-end gap-x-2">
          <n-button @click="show = false">取消</n-button>
          <n-button type="primary" :loading="saveLoading" @click="save">保存</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import {
  NModal,
  NTree,
  NButton,
  NText,
  useMessage
} from 'naive-ui'
import { ref, onMounted, h } from 'vue'
import type { SysRole } from '../types'
import { sysRoleService } from '../service'
import { menuService } from '@/views/system/menu/service'
import type { Menu } from '@/views/system/menu/types'
import LucideIcon from '@/components/LucideIcon'

const emit = defineEmits<{
  (e: 'success'): void
}>()
defineExpose({ open })

const message = useMessage()

const role = ref<SysRole>()

const show = ref(false)
function open(data: SysRole) {
  role.value = data
  show.value = true
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
const treeData = ref<Menu[]>([])
function fetchData() {
  menuService.tree().then((res) => {
    treeData.value = res.data || []
  })
}

const saveLoading = ref(false)
function save() {
  saveLoading.value = true
  sysRoleService.save(role.value).then(() => {
    emit('success')
    message.success('保存成功')
    show.value = false
  }).finally(() => {
    saveLoading.value = false
  })
}

onMounted(() => {
  fetchData()
})
</script>
<style scoped></style>
