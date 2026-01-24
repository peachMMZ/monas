<template>
  <div class="h-12 px-2 flex items-center justify-between">
    <div class="flex items-center">
      <n-button quaternary :focusable="false" :render-icon="renderIcon(collapseIcon)"
        @click="toggleCollapsed"></n-button>
      <n-breadcrumb>
        <n-breadcrumb-item v-for="item in matchedRoutes" :key="item.path" :to="item.path">
          {{ item.meta.title || '未命名页面' }}
        </n-breadcrumb-item>
      </n-breadcrumb>
    </div>
    <div class="flex justify-end items-center gap-x-4">
      <n-button :focusable="false" text :render-icon="renderIcon(themeIcon)" @click="themeStore.switchTheme"></n-button>
      <n-button :focusable="false" text :render-icon="renderIcon(MessageCircle)"></n-button>
      <n-button :focusable="false" text :render-icon="renderIcon(Palette)"
        @click="themeStore.themeDrawerShow = true"></n-button>
      <n-dropdown :options="avatarOptions" size="small" @select="onAvatarSelect">
        <n-element class="user-info flex items-center gap-x-2 cursor-pointer rounded-md m-1 p-1">
          <file-wrapper :file-id="userStore.loginUser?.avatar">
            <template #default="{ fileUrl }">
              <n-avatar :src="fileUrl" />
            </template>
          </file-wrapper>
          <div class="flex flex-col justify-center items-end text-xs">
            <n-text>{{ userStore.loginUser?.nickname }}</n-text>
            <n-text type="primary">信息部</n-text>
          </div>
        </n-element>
      </n-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NButton, NAvatar, NDropdown, NBreadcrumb, NBreadcrumbItem, NText, NElement, type DropdownOption, useMessage } from 'naive-ui'
import {
  ListIndentDecrease,
  ListIndentIncrease,
  Sun,
  MoonStar,
  MessageCircle,
  Palette,
  UserCircle,
  LogOut,
  Building,
} from 'lucide-vue-next'
import { renderIcon } from '@/utils/renderer'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useMenuStore } from '@/stores/menu'
import { useThemeStore } from '@/stores/theme'
import FileWrapper from '@/components/File/FileWrapper'

const emits = defineEmits<{
  (e: 'collapse', collapsed: boolean): void
}>()

const userStore = useUserStore()
const menuStore = useMenuStore()
const message = useMessage()
const themeStore = useThemeStore()

const router = useRouter()
const route = useRoute()
const matchedRoutes = computed(() => route.matched.filter((r) => r.meta && r.meta.title))

const collapsed = ref(false)
const collapseIcon = computed(() => (collapsed.value ? ListIndentIncrease : ListIndentDecrease))

function toggleCollapsed() {
  collapsed.value = !collapsed.value
  emits('collapse', collapsed.value)
}

const themeIcon = computed(() => (themeStore.theme === 'dark' ? MoonStar : Sun))

const avatarOptions: (DropdownOption & { action?: () => void })[] = [
  {
    key: 'profile',
    label: '个人中心',
    icon: renderIcon(UserCircle),
    action: () => {
      router.push({ name: 'profile' })
    }
  },
  {
    key: 'switch-department',
    label: '切换部门',
    icon: renderIcon(Building),
  },
  { type: 'divider' },
  {
    key: 'logout',
    label: '退出登录',
    icon: renderIcon(LogOut),
    action: () => {
      userStore.clearLogin()
      menuStore.removeAllTabs()
      menuStore.loaded = false
      message.success('退出成功')
    }
  },
]
function onAvatarSelect(key: string) {
  const option = avatarOptions.find((o) => o.key === key)
  if (option && option.action) {
    option.action()
  }
}
</script>
<style scoped>
.user-info:hover {
  background-color: var(--hover-color);
}
</style>
