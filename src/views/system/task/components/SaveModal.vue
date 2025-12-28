<template>
  <div>
    <n-modal v-model:show="show" title="保存" draggable preset="card" style="width: 40%">
      <n-form ref="formRef" :model="formData" :rules="rules">
        <n-grid :x-gap="12">
          <n-form-item-gi :span="18" label="任务名称" path="name">
            <n-input v-model:value="formData.name" clearable />
          </n-form-item-gi>
          <n-form-item-gi :span="6" label="是否启用" path="enabled">
            <n-switch v-model:value="formData.enabled" />
          </n-form-item-gi>
          <n-form-item-gi :span="24" label="Bean" path="beanName">
            <n-select v-model:value="formData.beanName" :options="availableBeans" filterable clearable />
          </n-form-item-gi>
          <n-form-item-gi :span="24" label="Cron表达式" path="cron">
            <n-input-group>
              <n-input v-model:value="formData.cron" clearable />
              <n-tooltip trigger="click">
                <template #trigger>
                  <n-button type="primary" @click="predict">预测</n-button>
                </template>
                <div v-if="predictResult && predictResult.length > 0">
                  <template v-for="(item, index) in predictResult" :key="index">
                    <div class="text-sm font-bold">
                      <span>{{ item }}</span>
                    </div>
                  </template>
                </div>
                <div v-else>
                  <span>暂无预测结果</span>
                </div>
              </n-tooltip>
            </n-input-group>
          </n-form-item-gi>
          <n-form-item-gi :span="24" label="参数" path="params">
            <n-input v-model:value="formData.params" type="textarea" />
          </n-form-item-gi>
          <n-form-item-gi :span="24" label="描述" path="description">
            <n-input v-model:value="formData.description" />
          </n-form-item-gi>
        </n-grid>
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
import { ref, onMounted, h, useTemplateRef } from 'vue'
import {
  NModal,
  NForm,
  NGrid,
  NFormItemGi,
  NInput,
  NInputGroup,
  NSwitch,
  NSelect,
  type SelectOption,
  NButton,
  NTooltip,
  type FormRules,
  type FormInst,
  useMessage
} from 'naive-ui'
import type { Task } from '../types'
import { taskService } from '../service'
import type { Optional } from '@/utils/type'

const emit = defineEmits<{
  (e: 'success', data: Task): void
}>()

const message = useMessage()

const show = defineModel('show', { default: false })
const formRef = useTemplateRef<FormInst>('formRef')
const formData = defineModel<Optional<Task, 'id' | 'beanName'>>('data', { required: true })
const rules: FormRules = {
  name: [{ required: true, message: '请输入任务名称' }],
  cron: [{ required: true, message: '请输入Cron表达式' }],
  beanName: [{ required: true, message: '请选择Bean' }],
}

const availableBeans = ref<SelectOption[]>([])
function fetchAvailable() {
  taskService.available().then((res) => {
    if (res.code === 200) {
      availableBeans.value = res.data?.map((item) => ({
        value: item.beanName,
        label: () => h('div', {}, [
          h('span', {}, item.beanName),
          h('span', { class: 'text-gray-400' }, `(${item.className})`),
        ]),
      })) || []
    }
  })
}

const predictResult = ref<string[]>([])
function predict() {
  taskService.predict(formData.value.cron).then((res) => {
    if (res.code === 200) {
      predictResult.value = res.data || []
    }
  })
}

const saveLoading = ref(false)
function save() {
  formRef.value?.validate().then((valid) => {
    if (valid) {
      saveLoading.value = true
      taskService.save(formData.value).then((res) => {
        saveLoading.value = false
        if (res.code === 200) {
          emit('success', res.data)
          message.success('保存成功')
          show.value = false
        }
      })
    }
  })
}

onMounted(() => {
  fetchAvailable()
})
</script>
<style scoped></style>
