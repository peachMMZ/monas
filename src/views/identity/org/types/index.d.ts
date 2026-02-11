import type { BaseEntity, BaseQuery } from '@/network/service'

export type OrgType = 'COMPANY' | 'DEPARTMENT' | 'TEAM' | 'PROJECT' | 'VIRTUAL'

export interface OrgUnit extends BaseEntity {
  code: string
  name: string
  type: OrgType
  parentId?: number
  path: string
  level: number
  sort: number
  enabled: boolean | 'true' | 'false'
  children?: OrgUnit[]
}

export interface OrgUnitQuery extends BaseQuery {
  code?: string
  name?: string
  type?: OrgType
  enabled?: boolean | 'true' | 'false'
  parentId?: number
}
