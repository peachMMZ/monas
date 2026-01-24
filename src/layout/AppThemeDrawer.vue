<template>
  <div>
    <n-drawer v-model:show="themeStore.themeDrawerShow" :width="400" placement="right">
      <n-drawer-content title="主题设置">
        <n-form size="small" label-placement="left" :label-width="120" label-align="left">
          <n-divider title-placement="center">主题模式</n-divider>
          <n-form-item label="选择主题">
            <n-radio-group v-model:value="themeStore.theme">
              <n-radio-button value="light">
                <div class="flex items-center justify-center gap-x-2">
                  <n-icon :component="Sun" />
                  <span>浅色</span>
                </div>
              </n-radio-button>
              <n-radio-button value="dark">
                <div class="flex items-center justify-center gap-x-2">
                  <n-icon :component="MoonStar" />
                  <span>深色</span>
                </div>
              </n-radio-button>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="跟随系统主题">
            <n-switch v-model:value="themeStore.followOsTheme" />
          </n-form-item>
          <n-form-item label="深色侧边栏">
            <n-switch v-model:value="themeStore.siderInverted" />
          </n-form-item>
          <n-divider title-placement="center">主题颜色</n-divider>
          <div class="grid grid-cols-6 gap-2">
            <div v-for="item in presetColors" :key="item.color">
              <n-tooltip>
                <template #trigger>
                  <div class="w-10 h-10 cursor-pointer hover:scale-102" :style="{
                    border: item.color == themeVars.primaryColor ? `2px solid ${themeVars.textColor1}` : undefined,
                    borderRadius: themeVars.borderRadius,
                    backgroundColor: item.color
                  }" @click="onSelectPresetColor(item)"></div>
                </template>
                <span>{{ item.name }}-{{ item.color }}</span>
              </n-tooltip>
            </div>
            <n-popover class="w-64">
              <template #trigger>
                <div
                  class="w-10 h-10 cursor-pointer hover:scale-102 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500"
                  :style="{ borderRadius: themeVars.borderRadius }">
                </div>
              </template>
              <div>
                <span>自定义</span>
                <n-color-picker :show-alpha="false" :value="themeVars.primaryColor" @update:value="updateThemeColor" />
              </div>
            </n-popover>
          </div>
          <n-divider title-placement="center">其它</n-divider>
          <n-form-item label="字体大小">
            <n-input-number :value="fontSizeValue" :min="10" :max="24" @update:value="themeStore.setFontSize" />
          </n-form-item>
        </n-form>

        <template #footer>
          <div class="flex justify-end gap-x-2">
            <n-popconfirm @positive-click="themeStore.rollbackTheme">
              <template #trigger>
                <n-button type="primary">重置</n-button>
              </template>
              <span>确认要重置主题吗？</span>
            </n-popconfirm>
          </div>
        </template>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NDrawer,
  NDrawerContent,
  NForm,
  NFormItem,
  NDivider,
  NRadioGroup,
  NRadioButton,
  NIcon,
  NSwitch,
  NTooltip,
  NPopover,
  NColorPicker,
  NButton,
  NPopconfirm,
  NInputNumber,
  useThemeVars
} from 'naive-ui'
import { Sun, MoonStar } from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'
import { debounce } from 'es-toolkit'

const themeStore = useThemeStore()
const themeVars = useThemeVars()

const presetColors = [
  { name: 'Gray', color: '#9ca3af', hover: '#d1d5db', pressed: '#6b7280', suppl: '#e5e7eb' },
  { name: 'Stone', color: '#a8a29e', hover: '#d6d3d1', pressed: '#78716c', suppl: '#e7e5e4' },
  { name: 'Red', color: '#f87171', hover: '#fca5a5', pressed: '#ef4444', suppl: '#fecaca' },
  { name: 'Orange', color: '#fb923c', hover: '#fdb74a', pressed: '#f97316', suppl: '#fed7aa' },
  { name: 'Amber', color: '#fbbf24', hover: '#fcd34d', pressed: '#f59e0b', suppl: '#fde68a' },
  { name: 'Yellow', color: '#facc15', hover: '#fde047', pressed: '#eab308', suppl: '#fef08a' },
  { name: 'Lime', color: '#a3e635', hover: '#bef264', pressed: '#84cc16', suppl: '#d9f99d' },
  { name: 'Green', color: '#4ade80', hover: '#86efac', pressed: '#22c55e', suppl: '#bbf7d0' },
  { name: 'Emerald', color: '#34d399', hover: '#6ee7b7', pressed: '#10b981', suppl: '#a7f3d0' },
  { name: 'Teal', color: '#2dd4bf', hover: '#5eead4', pressed: '#14b8a6', suppl: '#99f6e4' },
  { name: 'Cyan', color: '#22d3ee', hover: '#67e8f9', pressed: '#06b6d4', suppl: '#a5f3fc' },
  { name: 'Sky', color: '#38bdf8', hover: '#7dd3fc', pressed: '#0ea5e9', suppl: '#bae6fd' },
  { name: 'Blue', color: '#60a5fa', hover: '#93c5fd', pressed: '#3b82f6', suppl: '#bfdbfe' },
  { name: 'Indigo', color: '#818cf8', hover: '#a5b4fc', pressed: '#6366f1', suppl: '#c7d2fe' },
  { name: 'Violet', color: '#a78bfa', hover: '#c4b5fd', pressed: '#8b5cf6', suppl: '#ddd6fe' },
  { name: 'Purple', color: '#c084fc', hover: '#d8b4fe', pressed: '#a855f7', suppl: '#e9d5ff' },
  { name: 'Fuchsia', color: '#e879f9', hover: '#f0abfc', pressed: '#d946ef', suppl: '#f5d0fe' },
  { name: 'Pink', color: '#f472b6', hover: '#f9a8d4', pressed: '#ec4899', suppl: '#fbcfe8' },
  { name: 'Rose', color: '#fb7185', hover: '#fda4af', pressed: '#f43f5e', suppl: '#fecdd3' }
]
function onSelectPresetColor(colorStatus: typeof presetColors[0]) {
  if (!themeStore.themeOverride.common) {
    themeStore.themeOverride.common = {}
  }
  themeStore.themeOverride.common.primaryColor = colorStatus.color
  themeStore.themeOverride.common.primaryColorHover = colorStatus.hover
  themeStore.themeOverride.common.primaryColorPressed = colorStatus.pressed
  themeStore.themeOverride.common.primaryColorSuppl = colorStatus.suppl
}

const updateThemeColor = debounce(themeStore.setPrimaryColor, 200)

const fontSizeValue = computed(() => parseInt(themeVars.value.fontSize.replace('px', '')))
</script>
<style scoped></style>
