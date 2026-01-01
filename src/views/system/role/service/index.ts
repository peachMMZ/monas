import { BaseService } from '@/network/service'
import type { SysRole } from '../types'
import type { DataTableColumns } from 'naive-ui'
import { handleTableActions, type TableAction } from '@/utils/table'

export class SysRoleService extends BaseService<SysRole> {
  constructor() {
    super('/sys/role')
  }
}

export const sysRoleService = new SysRoleService()

export function getColumns(actions?: TableAction<SysRole>[]): DataTableColumns<SysRole> {
  const columns: DataTableColumns<SysRole> = [
    { type: 'selection' },
    {
      title: '序号',
      key: 'seq',
      render: (_rowData, rowIndex) => rowIndex + 1,
    },
    { title: '角色编码', key: 'roleCode' },
    { title: '角色名称', key: 'roleName' },
  ]

  handleTableActions(columns, actions)

  return columns
}
