<template>
  <n-spin class="h-full w-full" content-class="h-full" :show="loading">
    <n-card class="h-full" :title="`${isUpdate ? '编辑' : '新增'}菜单`" preset="card" draggable>
      <n-form ref="formRef" :model="formData" :rules="rules">
        <n-grid :cols="24" :x-gap="12">
          <n-form-item-gi :span="12" label="父菜单ID" path="parentId">
            <menu-tree-select v-model:value="formData.parentId" clearable filterable />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="菜单图标" path="icon">
            <icon-picker v-model:value="formData.icon" />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="菜单编码" path="code">
            <n-input v-model:value="formData.code" :disabled="isUpdate" />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="排序" path="sort">
            <n-input-number v-model:value="formData.sort" :min="0" />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="菜单名称" path="name">
            <n-input v-model:value="formData.name" />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="是否启用" path="enabled">
            <n-switch v-model:value="formData.enabled" />
          </n-form-item-gi>
          <n-form-item-gi :span="24" label="菜单路径" path="path">
            <n-input v-model:value="formData.path" />
          </n-form-item-gi>
          <n-form-item-gi :span="24" label="组件路径" path="component">
            <n-select v-model:value="formData.component" :options="viewOptions" clearable filterable />
          </n-form-item-gi>
        </n-grid>
      </n-form>
      <template #action>
        <div class="flex justify-end gap-x-2">
          <n-button type="primary" :loading="saving" @click="save">保存</n-button>
          <n-button @click="cancel">取消</n-button>
        </div>
      </template>
    </n-card>
  </n-spin>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, useTemplateRef } from 'vue'
import {
  NSpin,
  NCard,
  NForm,
  NGrid,
  NFormItemGi,
  NInput,
  NInputNumber,
  NSwitch,
  NButton,
  NSelect,
  type FormRules,
  type FormInst,
  useMessage
} from 'naive-ui'
import type { MenuForm } from '../types'
import { menuService } from '../service'
import { views } from '@/router'
import IconPicker from '@/components/IconInput'
import MenuTreeSelect from '@/components/MenuTreeSelect'

const props = defineProps<{
  menuId?: number
}>()
const emit = defineEmits<{
  (e: 'success'): void
}>()

const message = useMessage()

const viewOptions = Object.keys(views).map((key) => ({
  label: key,
  value: key,
}))
const defaultFormData = (): MenuForm => ({
  code: '',
  name: '',
  enabled: true,
  path: '',
  icon: '',
  component: null,
  sort: 0,
  parentId: null,
})
const formRef = useTemplateRef<FormInst>('formRef')
const formData = ref<MenuForm>(defaultFormData())
const isUpdate = computed(() => props.menuId !== undefined)
const rules: FormRules = {
  code: [{ required: true, message: '请输入菜单编码' }],
  name: [{ required: true, message: '请输入菜单名称' }],
  path: [{ required: true, message: '请输入菜单路径' }],
}

const loading = ref(false)
function fetchDetail() {
  if (!props.menuId) {
    return
  }
  loading.value = true
  menuService.detail({ id: props.menuId }).then((res) => {
    formData.value = res.data || defaultFormData()
  }).finally(() => {
    loading.value = false
  })
}

function reset() {
  formData.value = defaultFormData()
}
const saving = ref(false)
function save() {
  formRef.value?.validate().then(() => {
    saving.value = true
    menuService.save(formData.value).then((res) => {
      if (res.code === 200) {
        message.success('保存成功')
        emit('success')
        fetchDetail()
      }
    }).finally(() => {
      saving.value = false
    })
  })
}
function cancel() {
  reset()
}

watchEffect(() => {
  if (props.menuId) {
    fetchDetail()
  } else {
    reset()
  }
})
</script>
<style scoped></style>
