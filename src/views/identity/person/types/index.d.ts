import type { BaseEntity, BaseQuery } from '@/network/service'

export type PersonType = 'EMPLOYEE' | 'INTERN' | 'CONTRACTOR' | 'TEMPORARY'

export interface Person extends BaseEntity {
  code: string
  name: string
  enabled: boolean | 'true' | 'false'
  type: PersonType
  joinDate: string
  leaveDate?: string
  email?: string
  mobile?: string
}

export interface PersonQuery extends BaseQuery {
  code?: string
  name?: string
  type?: PersonType
  enabled?: 'true' | 'false'
}
