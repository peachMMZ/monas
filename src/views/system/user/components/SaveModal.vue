<template>
  <div>
    <n-modal v-model:show="show" title="保存" preset="card" draggable style="width: 400px;">
      <n-form ref="formRef" :model="formData" :rules="rules">
        <n-form-item label="账号" path="account">
          <n-input v-model:value="formData.account" disabled />
        </n-form-item>
        <n-form-item label="昵称" path="nickname">
          <n-input v-model:value="formData.nickname" />
        </n-form-item>
        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="formData.email" />
        </n-form-item>
        <n-form-item label="角色">
          <n-select v-model:value="formData.roleIds" multiple :options="roleOptions" :disabled="formData.builtin" />
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
  NButton,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  type FormRules,
  useMessage
} from 'naive-ui'
import { type SysUser } from '../types'
import { ref, useTemplateRef, onMounted } from 'vue'
import type { Optional } from '@/utils/type'
import { sysRoleService } from '@/views/system/role/service'
import { sysUserService } from '../service'

const emit = defineEmits<{
  (e: 'success'): void
}>()
defineExpose({ open })

const message = useMessage()

const show = ref(false)

const defaultFormData = (): Optional<SysUser, 'id'> => ({
  account: '',
  password: '',
  nickname: '',
  email: '',
  status: 'ACTIVE',
  builtin: false
})
const formRef = useTemplateRef('formRef')
const rules: FormRules = {
  nickname: [{ required: true, message: '请输入昵称' }],
  email: [{ required: true, message: '请输入邮箱' }],
}
const formData = ref<Optional<SysUser, 'id'>>(defaultFormData())

function open(data?: SysUser) {
  formData.value = data || defaultFormData()
  show.value = true
}

const roleOptions = ref<{ label: string; value: number }[]>([])
function fetchRoleList() {
  sysRoleService.list().then((res) => {
    if (res.code === 200) {
      roleOptions.value = res.data.map((item) => ({
        label: item.roleName,
        value: item.id
      }))
    }
  })
}

const saveLoading = ref(false)
function save() {
  formRef.value?.validate().then(() => {
    saveLoading.value = true
    sysUserService.save(formData.value).then(() => {
      emit('success')
      message.success('保存成功')
      show.value = false
    }).finally(() => {
      saveLoading.value = false
    })
  })
}

onMounted(() => {
  fetchRoleList()
})
</script>
<style scoped></style>
