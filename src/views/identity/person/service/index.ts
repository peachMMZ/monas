import { BaseService } from '@/network/service'
import type { Person } from '../types'
import { handleTableActions, type TableAction } from '@/utils/table'
import { NTag, type TagProps, type DataTableColumns } from 'naive-ui'
import { h } from 'vue'

export const enabledOptions = [
  { label: '已启用', value: 'true' },
  { label: '已禁用', value: 'false' },
]
export const personTypes: { label: string; value: Person['type'] }[] = [
  { label: '员工', value: 'EMPLOYEE' },
  { label: '实习生', value: 'INTERN' },
  { label: '外包', value: 'CONTRACTOR' },
  { label: '临时工', value: 'TEMPORARY' },
]

class PersonService extends BaseService<Person> {
  constructor() {
    super('/identity/person')
  }
}

export function getColumns(actions?: TableAction<Person>[]): DataTableColumns<Person> {
  const columns: DataTableColumns<Person> = [
    { type: 'selection' },
    {
      title: '序号',
      key: 'seq',
      resizable: true,
      render: (_rowData, rowIndex) => rowIndex + 1,
    },
    { title: '姓名', key: 'name', resizable: true },
    { title: '工号', key: 'code', resizable: true },
    {
      title: '类型',
      key: 'type',
      resizable: true,
      render: (rowData) => {
        const label = personTypes.find((item) => item.value === rowData.type)?.label || '-'
        let type: TagProps['type'] = 'primary'
        if (rowData.type === 'EMPLOYEE') {
          type = 'success'
        } else if (rowData.type === 'INTERN') {
          type = 'info'
        } else if (rowData.type === 'CONTRACTOR') {
          type = 'warning'
        } else if (rowData.type === 'TEMPORARY') {
          type = 'error'
        }
        return h(NTag, { type, size: 'small' }, { default: () => label })
      },
    },
    { title: '邮箱', key: 'email', resizable: true },
    { title: '手机号', key: 'mobile', resizable: true },
    {
      title: '是否启用',
      key: 'enabled',
      resizable: true,
      render: (rowData) =>
        h(
          NTag,
          { type: rowData.enabled ? 'success' : 'error', size: 'small' },
          { default: () => (rowData.enabled ? '已启用' : '已禁用') },
        ),
    },
    { title: '入职日期', key: 'joinDate', resizable: true },
    { title: '离职日期', key: 'leaveDate', resizable: true },
  ]

  handleTableActions(columns, actions)

  return columns
}

export const personService = new PersonService()
