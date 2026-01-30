import { ref, computed, watch } from 'vue'
import type { Tab } from './types/menu'
import { defineStore } from 'pinia'
import router, { views } from '@/router'
import { menuService } from '@/views/system/menu/service'
import type { Menu } from '@/views/system/menu/types'

export * from './types/menu.d'

const ignorePaths = ['/', '/home', '/404', '/login']

export const useMenuStore = defineStore('menu', () => {
  const loaded = ref(false)
  const current = computed(() => router.currentRoute.value.path)

  const menus = ref<Menu[]>([])
  const tabs = ref<Tab[]>([])
  const keepAliveRoutes = ref<string[]>([])

  watch(
    [current, tabs],
    ([path, tabs]) => {
      addTab(path)
      updateKeepAliveRoutes(tabs)
    },
    { immediate: true },
  )

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

  async function updateKeepAliveRoutes(tabs: Tab[]) {
    const paths = tabs.map((tab) => tab.path)
    const names = await Promise.all(paths.map(getComponentName))
    keepAliveRoutes.value = names.filter((name) => name !== undefined)
  }

  const componentNameCacheMap = new Map<string, string>()
  async function getComponentName(path: string) {
    if (componentNameCacheMap.has(path)) return componentNameCacheMap.get(path)
    const route = router.getRoutes().find((item) => item.path === path)
    if (!route) return
    // 缓存路由组件
    if (route.meta.keepAlive && route.meta.componentPath) {
      const component = views[route.meta.componentPath]
      if (component) {
        const mod = await component()
        const componentName = (mod as { default: { name: string } }).default.name
        componentNameCacheMap.set(path, componentName)
        return componentName
      }
    }
  }

  function addTab(path: string) {
    if (ignorePaths.includes(path)) return
    const tabExists = tabs.value.some((tab) => tab.path === path)
    const route = router.getRoutes().find((item) => item.path === path)
    if (!route || route.meta.hidden) return
    if (!tabExists) {
      tabs.value.push({
        label: route?.meta?.title || '未命名页面',
        path: path,
        icon: route?.meta?.icon,
        cached: route?.meta?.keepAlive,
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
    keepAliveRoutes,
    init,
    fetchMenus,
    onMenuSelect,
    removeTab,
    removeAllTabs,
    removeOtherTabs,
  }
})
