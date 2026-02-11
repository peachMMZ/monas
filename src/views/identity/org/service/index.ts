import { BaseService } from '@/network/service'
import { handleTableActions, type TableAction } from '@/utils/table'
import type { OrgUnit, OrgUnitQuery } from '@/views/identity/org/types'
import { type DataTableColumns, NTag, type TagProps } from 'naive-ui'
import { h } from 'vue'

export const orgTypes: { label: string; value: OrgUnit['type'] }[] = [
  { label: '公司', value: 'COMPANY' },
  { label: '部门', value: 'DEPARTMENT' },
  { label: '团队', value: 'TEAM' },
  { label: '项目组', value: 'PROJECT' },
  { label: '虚拟组织', value: 'VIRTUAL' },
]

export const enabledOptions = [
  { label: '已启用', value: 'true' },
  { label: '已禁用', value: 'false' },
]

class OrgUnitService extends BaseService<OrgUnit, OrgUnitQuery> {
  constructor() {
    super('/identity/org')
  }

  roots() {
    return this.request<OrgUnit[]>({
      url: `${this.getPrefix()}/roots`,
      method: 'GET',
    })
  }

  tree() {
    return this.request<OrgUnit[]>({
      url: `${this.getPrefix()}/tree`,
      method: 'GET',
    })
  }
}

export function getColumns(actions?: TableAction<OrgUnit>[]): DataTableColumns<OrgUnit> {
  const columns: DataTableColumns<OrgUnit> = [
    { type: 'selection' },
    { title: '组织名称', key: 'name' },
    { title: '组织编码', key: 'code' },
    {
      title: '组织类型',
      key: 'type',
      render: (rowData) => {
        const typeLabel = orgTypes.find((item) => item.value === rowData.type)?.label
        let nTagType: TagProps['type'] = 'primary'
        if (rowData.type === 'COMPANY') {
          nTagType = 'primary'
        } else if (rowData.type === 'DEPARTMENT') {
          nTagType = 'success'
        } else if (rowData.type === 'TEAM') {
          nTagType = 'info'
        } else if (rowData.type === 'PROJECT') {
          nTagType = 'warning'
        } else if (rowData.type === 'VIRTUAL') {
          nTagType = 'default'
        }
        return h(NTag, { type: nTagType, size: 'small' }, { default: () => typeLabel || '-' })
      },
    },
    {
      title: '是否启用',
      key: 'enabled',
      render: (rowData) =>
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

export const orgUnitService = new OrgUnitService()
