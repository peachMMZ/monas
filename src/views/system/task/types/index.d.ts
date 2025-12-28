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

export type TaskStatus = 'RUNNING' | 'SUCCESS' | 'FAILED' | 'INTERRUPTED' | 'LOST'

export interface TaskLog extends BaseEntity {
  taskId: number
  startTime: string
  endTime?: string
  status: TaskStatus
  duration?: number
  errorMessage?: string
}

export interface TaskLogQuery extends BaseQuery {
  taskId?: number
  status?: TaskStatus
  createdDateBetween?: [string, string]
}
