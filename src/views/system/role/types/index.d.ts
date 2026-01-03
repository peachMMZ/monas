import type { BaseEntity, BaseQuery } from '@/network/service'

export interface SysRole extends BaseEntity {
  roleCode: string
  roleName: string
  menuScope?: 'ALL' | 'ASSIGNED' | 'CUSTOM'
  menuIds?: number[]
  apiIds?: number[]
}

export interface SysRoleQuery extends BaseQuery {
  roleCode?: string
  roleName?: string
}
