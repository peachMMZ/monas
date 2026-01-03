import { h } from 'vue'
import { BaseService } from '@/network/service'
import { NTag, type DataTableColumns } from 'naive-ui'
import type { SysUser } from '../types'
import { handleTableActions, type TableAction } from '@/utils/table'

export const userStatusOptions = [
  {
    label: '已激活',
    value: 'ACTIVE',
  },
  {
    label: '已禁用',
    value: 'DISABLED',
  },
  {
    label: '待邮箱验证',
    value: 'WAITING_EMAIL_VERIFICATION',
  },
]

export class UserService extends BaseService<SysUser> {
  constructor() {
    super('/sys/user')
  }

  async updateStatus(userId: number, status: SysUser['status']) {
    return this.request<null>({
      method: 'POST',
      url: `/sys/user/${userId}/status`,
      data: {
        status,
      },
    })
  }
}

export const sysUserService = new UserService()

export function getColumns(actions?: TableAction<SysUser>[]): DataTableColumns<SysUser> {
  const columns: DataTableColumns<SysUser> = [
    { type: 'selection' },
    {
      title: '序号',
      key: 'seq',
      render: (_rowData: SysUser, rowIndex: number) => rowIndex + 1,
    },
    { title: '账号', key: 'account' },
    { title: '昵称', key: 'nickname' },
    { title: '邮箱', key: 'email' },
    {
      title: '是否内置',
      key: 'builtin',
      render: (rowData: SysUser) =>
        h(
          NTag,
          { type: rowData.builtin ? 'success' : 'error', size: 'small' },
          { default: () => (rowData.builtin ? '是' : '否') },
        ),
    },
    {
      title: '状态',
      key: 'status',
      render: (rowData: SysUser) =>
        h(
          NTag,
          { type: rowData.status === 'ACTIVE' ? 'success' : 'error', size: 'small' },
          {
            default: () =>
              userStatusOptions.find((item) => item.value === rowData.status)?.label ||
              rowData.status,
          },
        ),
    },
  ]

  handleTableActions(columns, actions)

  return columns
}
