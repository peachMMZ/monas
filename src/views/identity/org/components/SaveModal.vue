<template>
  <div>
    <n-modal v-model:show="show" title="保存" draggable preset="card" style="width: 30%">
      <n-form ref="formRef" :model="formData" :rules="rules">
        <n-grid :x-gap="12">
          <n-form-item-gi :span="24" label="上级组织" path="parentId">
            <n-select v-model:value="formData.parentId" :options="orgUnitOptions" clearable disabled />
          </n-form-item-gi>
          <n-form-item-gi :span="24" label="组织名称" path="name">
            <n-input v-model:value="formData.name" clearable />
          </n-form-item-gi>
          <n-form-item-gi :span="24" label="组织编码" path="code">
            <n-input v-model:value="formData.code" clearable :disabled="!isNew" />
          </n-form-item-gi>
          <n-form-item-gi :span="24" label="组织类型" path="type">
            <n-select v-model:value="formData.type" :options="orgTypes" :disabled="!isNew" />
          </n-form-item-gi>
          <n-form-item-gi :span="18" label="排序" path="sort">
            <n-input-number v-model:value="formData.sort" clearable />
          </n-form-item-gi>
          <n-form-item-gi :span="6" label="是否启用" path="enabled">
            <n-switch v-model:value="formData.enabled" />
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
import { ref, useTemplateRef, computed, onMounted, watchEffect } from 'vue'
import {
  NModal,
  NForm,
  NGrid,
  NFormItemGi,
  NInput,
  NInputNumber,
  NSelect,
  NButton,
  NSwitch,
  type FormRules,
  type FormInst,
  useMessage
} from 'naive-ui'
import type { OrgUnit } from '../types'
import { orgTypes, orgUnitService } from '../service'
import type { Optional } from '@/utils/type'

const props = defineProps<{
  parentId?: number
}>()

const emit = defineEmits<{
  (e: 'success', data: OrgUnit): void
}>()

const message = useMessage()
const isNew = computed(() => !formData.value?.id)

const show = defineModel('show', { default: false })
const formRef = useTemplateRef<FormInst>('formRef')
const formData = defineModel<Optional<OrgUnit, 'id'>>('data', { required: true })
const rules: FormRules = {
  name: [{ required: true, message: '请输入姓名' }],
  code: [{ required: true, message: '请输入工号' }],
  type: [{ required: true, message: '请选择类型' }],
}

const orgUnitOptions = ref<{ label: string, value: number }[]>([])
const orgUnitList = ref<OrgUnit[]>([])
function fetchAllOrgUnits() {
  orgUnitService.list().then((res) => {
    if (res.code === 200) {
      orgUnitList.value = res.data
      orgUnitOptions.value = res.data.map((item) => ({
        label: item.name,
        value: item.id,
      }))
    }
  })
}

const saveLoading = ref(false)
function save() {
  formRef.value?.validate().then((valid) => {
    if (valid) {
      saveLoading.value = true
      orgUnitService.save(formData.value).then((res) => {
        saveLoading.value = false
        if (res.code === 200) {
          emit('success', res.data)
          message.success('保存成功')
          show.value = false
          fetchAllOrgUnits()
        }
      }).finally(() => {
        saveLoading.value = false
      })
    }
  })
}

onMounted(() => {
  fetchAllOrgUnits()
  watchEffect(() => {
    if (props.parentId && isNew.value) {
      formData.value.parentId = props.parentId
      const parent = orgUnitList.value.find((item) => item.id === props.parentId)
      if (parent) {
        if (parent.type === 'COMPANY') {
          formData.value.type = 'DEPARTMENT'
        } else if (parent.type === 'DEPARTMENT') {
          formData.value.type = 'TEAM'
        } else if (parent.type === 'TEAM') {
          formData.value.type = 'PROJECT'
        }
        formData.value.level = parent.level + 1
        formData.value.path = `${parent.path}/${parent.id}`
      }
    } else {
      formData.value.parentId = undefined
    }
  })
})
</script>
<style scoped></style>
