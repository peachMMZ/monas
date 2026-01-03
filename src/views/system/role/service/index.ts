import { BaseService } from '@/network/service'
import type { SysRole } from '../types'
import { NTag, type DataTableColumns } from 'naive-ui'
import { handleTableActions, type TableAction } from '@/utils/table'
import { h } from 'vue'

export const menuScopeOptions = [
  { label: '所有菜单', value: 'ALL' },
  { label: '授权菜单', value: 'ASSIGNED' },
]

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
    {
      title: '菜单权限',
      key: 'menuScope',
      render: (row) =>
        h(
          NTag,
          { type: row.menuScope === 'ALL' ? 'primary' : 'info', size: 'small' },
          {
            default: () =>
              menuScopeOptions.find((item) => item.value === row.menuScope)?.label || '',
          },
        ),
    },
  ]

  handleTableActions(columns, actions)

  return columns
}
