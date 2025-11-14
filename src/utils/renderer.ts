import type { Menu } from '@/views/system/menu/types'
import { NIcon, type IconProps } from 'naive-ui'
import { type Component, h } from 'vue'
import { RouterLink } from 'vue-router'
import LucideIcon, { type IconName } from '@/components/LucideIcon'

export function renderIcon(icon: IconName | Component, options?: IconProps) {
  if (typeof icon === 'string') {
    return () => h(NIcon, options, { default: () => h(LucideIcon, { name: icon }) })
  } else {
    return () => h(NIcon, options, { default: () => h(icon) })
  }
}

export function renderMenuLabel(menu: Menu) {
  if (menu.component) {
    return () => h(RouterLink, { to: menu.path }, { default: () => menu.name || '' })
  } else {
    return () => menu.name || ''
  }
}
