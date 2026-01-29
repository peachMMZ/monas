import type { BaseQuery } from '@/network/service'

export interface Menu {
  id: number
  code: string
  name: string
  enabled: boolean
  path: string
  icon?: string
  component?: string | null
  sort?: number
  keepAlive?: boolean
  parentId?: number | null
  children?: Menu[]
}

export type MenuForm = Omit<Menu, 'id' | 'children'>

export interface MenuQuery extends BaseQuery {
  id?: number
  code?: string
  name?: string
  path?: string
}
