import { ref, computed, watch } from 'vue'
import type { Tab } from './types/menu'
import { defineStore } from 'pinia'
import router from '@/router'
import { menuService } from '@/views/system/menu/service'
import type { Menu } from '@/views/system/menu/types'

export * from './types/menu.d'

const ignorePaths = ['/', '/home', '/404', '/login']

export const useMenuStore = defineStore('menu', () => {
  const loaded = ref(false)
  const current = computed(() => router.currentRoute.value.path)
  watch(
    () => current.value,
    (path) => {
      addTab(path)
    },
    { immediate: true },
  )

  const menus = ref<Menu[]>([])
  const tabs = ref<Tab[]>([])

  async function init() {
    loaded.value = false
  }

  async function fetchMenus() {
    const res = await menuService.tree()
    menus.value = res.data
    loaded.value = true
  }

  function onMenuSelect(key: string) {
    if (key === '/' || key === '/home') {
      router.push('/home')
      return
    }
    const route = menus.value.find((item) => item.path === key)
    if (route && route.component) {
      router.push(key)
    }
  }

  function addTab(path: string) {
    if (ignorePaths.includes(path)) return
    const tabExists = tabs.value.some((tab) => tab.path === path)
    const route = router.getRoutes().find((item) => item.path === path)
    if (!tabExists) {
      tabs.value.push({
        label: route?.meta?.title || '未命名页面',
        path: path,
      })
    }
  }

  function removeTab(path: string) {
    if (ignorePaths.includes(path)) return
    const i = tabs.value.findIndex((t) => t.path === path)
    if (i === -1) return
    const currentPath = router.currentRoute.value.path
    const isActive = currentPath === path
    tabs.value.splice(i, 1)
    if (!isActive) return
    const nextTab = tabs.value[i - 1] ?? tabs.value[i] ?? { path: '/home' }
    router.replace(nextTab.path)
  }

  function removeAllTabs() {
    tabs.value = []
    router.push('/home')
  }

  function removeOtherTabs(path: string) {
    tabs.value = tabs.value.filter((tab) => tab.path === path)
  }

  return {
    loaded,
    current,
    menus,
    tabs,
    init,
    fetchMenus,
    onMenuSelect,
    removeTab,
    removeAllTabs,
    removeOtherTabs,
  }
})
