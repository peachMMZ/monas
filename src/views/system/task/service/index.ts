import { h } from 'vue'
import { NTag, type DataTableColumns } from 'naive-ui'
import { BaseService } from '@/network/service'
import type {
  AvailableTaskBean,
  Task,
  TaskLog,
  TaskLogQuery,
  TaskStatus,
} from '@/views/system/task/types'
import { handleTableActions, type TableAction } from '@/utils/table'

export const enabledOptions = [
  {
    label: '已启用',
    value: 'true',
  },
  {
    label: '已禁用',
    value: 'false',
  },
]

class TaskService extends BaseService<Task> {
  constructor() {
    super('/schedule/task')
  }

  async run(taskId: Task['id']) {
    return this.request({
      method: 'POST',
      url: `${this.getPrefix()}/run`,
      params: {
        id: taskId,
      },
    })
  }

  async toggleEnabled(task: Task) {
    task.enabled = !task.enabled
    return this.save(task)
  }

  async available() {
    return this.request<AvailableTaskBean[]>({
      method: 'GET',
      url: `${this.getPrefix()}/available`,
    })
  }

  async predict(cron: string, count?: number) {
    return this.request<string[]>({
      method: 'GET',
      url: `${this.getPrefix()}/predict`,
      params: {
        cron,
        count,
      },
    })
  }
}

export const taskStatusOptions: { label: string; value: TaskStatus }[] = [
  { label: '运行中', value: 'RUNNING' },
  { label: '成功', value: 'SUCCESS' },
  { label: '失败', value: 'FAILED' },
  { label: '中断', value: 'INTERRUPTED' },
  { label: '丢失', value: 'LOST' },
]
export class TaskLogService extends BaseService<TaskLog, TaskLogQuery> {
  constructor() {
    super('/schedule/task/log')
  }
}

export function getColumns(actions?: TableAction<Task>[]): DataTableColumns<Task> {
  const columns: DataTableColumns<Task> = [
    { type: 'selection' },
    {
      title: '序号',
      key: 'seq',
      render: (_rowData: Task, rowIndex: number) => rowIndex + 1,
    },
    { title: '任务名称', key: 'name' },
    { title: '任务描述', key: 'description' },
    { title: 'Cron表达式', key: 'cron' },
    { title: 'Bean', key: 'beanName' },
    { title: '参数', key: 'params' },
    {
      title: '状态',
      key: 'enabled',
      render: (rowData: Task) =>
        h(
          NTag,
          { type: rowData.enabled ? 'success' : 'error', size: 'small' },
          { default: () => (rowData.enabled ? '已启用' : '已禁用') },
        ),
    },
  ]

  handleTableActions(columns, actions)

  return columns
}

export const taskService = new TaskService()
export const taskLogService = new TaskLogService()
