import type { BaseEntity, BaseQuery } from '@/network/service'

export type UserStatus = 'ACTIVE' | 'DISABLED' | 'WAITING_EMAIL_VERIFICATION'

export interface SysUser extends BaseEntity {
  account: string
  password?: string
  nickname: string
  email: string
  status: UserStatus
  builtin: boolean
  roleCodes?: string[]
  apiCodes?: string[]
  roleIds?: number[]
}

export interface SysUserQuery extends BaseQuery {
  account?: string
  email?: string
  nickname?: string
  status?: UserStatus
  createBetween?: [string, string]
}
