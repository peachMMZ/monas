<template>
  <n-scrollbar class="h-full">
    <div class="max-w-4xl m-auto">
      <n-grid :x-gap="12" :y-gap="12">
        <n-gi :span="24">
          <n-card size="small">
            <app-logo />
          </n-card>
        </n-gi>
        <n-gi :span="12">
          <n-card title="项目信息" size="small">
            <n-space vertical>
              <n-text class="flex items-center gap-2">
                <n-icon size="18" color="#18a058">
                  <check-circle />
                </n-icon>
                版本：{{ version }}
              </n-text>
              <n-text class="flex items-center gap-2">
                <n-icon size="18" color="#2080f0">
                  <calendar />
                </n-icon>
                构建时间：{{ buildTime }}
              </n-text>
              <n-text class="flex items-center gap-2">
                <n-icon size="18" color="#f0a020" :component="Code" />
                环境：{{ environment }}
              </n-text>
            </n-space>
          </n-card>
        </n-gi>
        <n-gi :span="12">
          <n-card title="技术栈" size="small">
            <div class="flex flex-wrap gap-1">
              <n-tag type="primary" size="small">Vue 3</n-tag>
              <n-tag type="info" size="small">TypeScript</n-tag>
              <n-tag type="success" size="small">Naive UI</n-tag>
              <n-tag type="warning" size="small">Pinia</n-tag>
              <n-tag type="error" size="small">Vite</n-tag>
              <n-tag type="default" size="small">Tailwind CSS</n-tag>
            </div>
          </n-card>
        </n-gi>
        <n-gi :span="12">
          <n-card title="功能特性" size="small">
            <n-list>
              <n-list-item>
                <template #prefix>
                  <n-icon size="20" color="#18a058">
                    <shield-check />
                  </n-icon>
                </template>
                <n-text>基于 RBAC 的权限管理系统</n-text>
              </n-list-item>
              <n-list-item>
                <template #prefix>
                  <n-icon size="20" color="#2080f0">
                    <palette />
                  </n-icon>
                </template>
                <n-text>支持明暗主题切换</n-text>
              </n-list-item>
              <n-list-item>
                <template #prefix>
                  <n-icon size="20" color="#f0a020">
                    <layout />
                  </n-icon>
                </template>
                <n-text>响应式布局设计</n-text>
              </n-list-item>
              <n-list-item>
                <template #prefix>
                  <n-icon size="20" color="#d03050">
                    <zap />
                  </n-icon>
                </template>
                <n-text>高性能前端架构</n-text>
              </n-list-item>
            </n-list>
          </n-card>
        </n-gi>
        <n-gi :span="12">
          <n-card title="开发团队" size="small">
            <n-space vertical>
              <n-text class="flex items-center gap-2">
                <n-icon size="18" color="#18a058">
                  <users />
                </n-icon>
                团队：信息部
              </n-text>
              <n-text class="flex items-center gap-2">
                <n-icon size="18" color="#2080f0">
                  <mail />
                </n-icon>
                联系：admin@example.com
              </n-text>
              <n-text class="flex items-center gap-2">
                <n-icon size="18" color="#f0a020">
                  <github />
                </n-icon>
                GitHub：https://github.com/your-org/monas
              </n-text>
            </n-space>
          </n-card>
        </n-gi>
      </n-grid>
      <div class="text-center mt-5 pt-5 border-t border-n-border">
        <n-text depth="3" class="text-sm">
          © 2024 {{ appName }}. All rights reserved.
        </n-text>
      </div>
    </div>
  </n-scrollbar>
</template>

<script setup lang="ts">
import {
  NScrollbar,
  NCard,
  NText,
  NGrid,
  NGi,
  NSpace,
  NIcon,
  NTag,
  NList,
  NListItem,
} from 'naive-ui'
import {
  CheckCircle,
  Calendar,
  Code,
  ShieldCheck,
  Palette,
  Layout,
  Zap,
  Users,
  Mail,
  Github,
} from 'lucide-vue-next'
import AppLogo from '@/layout/AppLogo.vue'

// 直接导入package.json获取版本信息
import packageInfo from '../../../package.json'

defineOptions({
  name: 'AboutView',
})

const appName = import.meta.env.VITE_APP_NAME || packageInfo.name
const version = packageInfo.version
const buildTime = new Date().toLocaleString('zh-CN')
const environment = import.meta.env.MODE === 'development' ? '开发环境' : '生产环境'
</script>

<style scoped></style>
