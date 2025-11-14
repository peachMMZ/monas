<template>
  <div>
    <n-input-group>
      <n-auto-complete v-model:value="iconName" :options="options" :render-label="renderLable" placeholder="请输入图标名称" />
      <n-button>
        <template #icon>
          <lucide-icon v-if="iconName" :name="iconName" />
          <circle-question-mark v-else />
        </template>
      </n-button>
    </n-input-group>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { NInputGroup, NButton, NAutoComplete, type SelectOption } from 'naive-ui'
import LucideIcon from '../LucideIcon'
import { CircleQuestionMark } from 'lucide-vue-next'
import { icons } from '../LucideIcon'

defineOptions({
  name: 'IconPicker',
})

const iconName = defineModel<string>('value', { required: false })
const options = computed(() => {
  return Object.keys(icons).filter(filterIconName).map((icon) => {
    return {
      label: icon,
      value: icon,
    }
  })
})
function filterIconName(value: string) {
  return value.toLowerCase().includes((iconName.value || '').toLowerCase()) && !value.includes('Lucide')
}
function renderLable(option: SelectOption) {
  return h('div', { class: 'flex justify-between items-center gap-x-2' }, [
    h(LucideIcon, { name: option.value as string, size: 20 }),
    option.label as string,
  ])
}
</script>
<style scoped></style>
