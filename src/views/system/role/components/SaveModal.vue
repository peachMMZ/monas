<template>
  <div>
    <n-modal v-model:show="show" title="保存" preset="card" draggable style="width: 400px;">
      <n-form ref="formRef" :model="formData" :rules="rules">
        <n-form-item label="角色编码" prop="roleCode" path="roleCode">
          <n-input v-model:value="formData.roleCode" />
        </n-form-item>
        <n-form-item label="角色名称" prop="roleName" path="roleName">
          <n-input v-model:value="formData.roleName" />
        </n-form-item>
        <n-form-item label="菜单权限" prop="menuScope" path="menuScope">
          <n-select v-model:value="formData.menuScope" :options="menuScopeOptions" />
        </n-form-item>
      </n-form>
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
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSelect,
  type FormInst,
  type FormRules,
  useMessage
} from 'naive-ui'
import { ref, useTemplateRef } from 'vue'
import type { SysRole } from '../types'
import type { Optional } from '@/utils/type'
import { sysRoleService, menuScopeOptions } from '../service'

const emit = defineEmits<{
  (e: 'success'): void
}>()

const message = useMessage()

const show = ref(false)
const defaultFormData = (): Optional<SysRole, 'id'> => {
  return {
    roleCode: '',
    roleName: '',
    menuScope: 'ASSIGNED',
  }
}

const rules: FormRules = {
  roleCode: [{ required: true, message: '请输入角色编码' }],
  roleName: [{ required: true, message: '请输入角色名称' }],
}
const formRef = useTemplateRef<FormInst>('formRef')
const formData = ref<Optional<SysRole, 'id'>>(defaultFormData())

defineExpose({
  open: (data?: Optional<SysRole, 'id'>) => {
    show.value = true
    formData.value = data || defaultFormData()
  }
})

const saveLoading = ref(false)
function save() {
  formRef.value?.validate().then(() => {
    saveLoading.value = true
    sysRoleService.save(formData.value).then((res) => {
      if (res.code === 200) {
        emit('success')
        message.success('保存成功')
        show.value = false
      }
    }).finally(() => {
      saveLoading.value = false
    })
  })
}
</script>
<style scoped></style>
