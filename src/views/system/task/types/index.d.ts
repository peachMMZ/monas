import type { BaseEntity, BaseQuery } from '@/network/service'

export interface Task extends BaseEntity {
  name: string
  description?: string
  cron: string
  beanName: string
  params?: string
  enabled: boolean
}

export interface TaskQuery extends BaseQuery {
  name?: string
  beanName?: string
  enabled?: 'true' | 'false'
  description?: string
}

export interface AvailableTaskBean {
  beanName: string
  className: string
}
