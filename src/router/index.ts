import type { Component } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import routes from './routes'
import { createDiscreteApi } from 'naive-ui'
import { useMenuStore } from '@/stores/menu'
import { useUserStore } from '@/stores/user'
import type { Menu } from '@/views/system/menu/types'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string | Component
    hidden?: boolean
    sort?: number
  }
}

const { loadingBar } = createDiscreteApi(['loadingBar'])

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

const WHITE_LIST = ['/login', '/404', '/500']

export const views = import.meta.glob('@/views/**/index.vue')
export function buildRoutes(menus: Menu[]) {
  function tree(items: Menu[]): RouteRecordRaw[] {
    const routes = items.map((item) => {
      const route = menuToRoute(item)
      if (item.children?.length) {
        route.children = tree(item.children)
      }
      return route
    })
    return routes
  }
  const routes = tree(menus)
  routes.forEach((item) => router.addRoute('root', item))
}
function menuToRoute(menu: Menu): RouteRecordRaw {
  return {
    redirect: undefined,
    path: menu.path,
    name: menu.code,
    meta: {
      title: menu.name,
      icon: menu.icon,
    },
    component: menu.component ? views[menu.component] : undefined,
    children: [],
  }
}

router.beforeEach(async (to, _from, next) => {
  loadingBar.start()
  const userStore = useUserStore()
  if (!userStore.logined) {
    if (WHITE_LIST.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
    return
  }

  const menuStore = useMenuStore()
  if (!menuStore.loaded) {
    try {
      await menuStore.fetchMenus()
      buildRoutes(menuStore.menus)
      next({ ...to, replace: true })
      return
    } catch (error) {
      console.error(error)
      next({ name: 'server-error' })
      menuStore.loaded = true
      return
    }
  } else {
    if (router.hasRoute(to.name as string)) {
      next()
    } else {
      next({ name: 'not-found' })
    }
  }
})

router.afterEach((_to, _from) => {
  loadingBar.finish()
})

export default router
