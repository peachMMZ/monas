<template>
  <div>
    <n-modal v-model:show="show" title="保存" draggable preset="card" style="width: 30%">
      <n-form ref="formRef" :model="formData" :rules="rules">
        <n-grid :x-gap="12">
          <n-form-item-gi :span="12" label="姓名" path="name">
            <n-input v-model:value="formData.name" clearable />
          </n-form-item-gi>
          <n-form-item-gi :span="12" label="工号" path="code">
            <n-input v-model:value="formData.code" clearable :disabled="!isNew" />
          </n-form-item-gi>
          <n-form-item-gi :span="16" label="类型" path="type">
            <n-select v-model:value="formData.type" :options="personTypes" />
          </n-form-item-gi>
          <n-form-item-gi :span="8" label="是否启用" path="enabled">
            <n-switch v-model:value="formData.enabled" />
          </n-form-item-gi>
          <n-form-item-gi :span="24" label="手机号" path="mobile">
            <n-input v-model:value="formData.mobile" clearable />
          </n-form-item-gi>
          <n-form-item-gi :span="24" label="邮箱" path="email">
            <n-input v-model:value="formData.email" clearable />
          </n-form-item-gi>
          <n-form-item-gi :span="24" label="入职日期" path="joinDate">
            <n-date-picker v-model:formatted-value="formData.joinDate" type="date" value-format="yyyy-MM-dd" clearable
              disabled />
          </n-form-item-gi>
        </n-grid>
      </n-form>

      <template #action>
        <div class="flex justify-end gap-x-2">
          <n-button type="primary" :loading="saveLoading" @click="save">保存</n-button>
          <n-button @click="show = false">取消</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, computed } from 'vue'
import {
  NModal,
  NForm,
  NGrid,
  NFormItemGi,
  NInput,
  NSelect,
  NButton,
  NSwitch,
  NDatePicker,
  type FormRules,
  type FormInst,
  useMessage
} from 'naive-ui'
import type { Person } from '../types'
import { personTypes, personService } from '../service'
import type { Optional } from '@/utils/type'

const emit = defineEmits<{
  (e: 'success', data: Person): void
}>()

const message = useMessage()

const show = defineModel('show', { default: false })
const formRef = useTemplateRef<FormInst>('formRef')
const formData = defineModel<Optional<Person, 'id'>>('data', { required: true })
const isNew = computed(() => !formData.value.id)
const rules: FormRules = {
  name: [{ required: true, message: '请输入姓名' }],
  code: [{ required: true, message: '请输入工号' }],
  type: [{ required: true, message: '请选择类型' }],
  mobile: [{ required: true, message: '请输入手机号' }],
}

const saveLoading = ref(false)
function save() {
  formRef.value?.validate().then((valid) => {
    if (valid) {
      saveLoading.value = true
      personService.save(formData.value).then((res) => {
        saveLoading.value = false
        if (res.code === 200) {
          emit('success', res.data)
          message.success('保存成功')
          show.value = false
        }
      }).finally(() => {
        saveLoading.value = false
      })
    }
  })
}
</script>
<style scoped></style>
