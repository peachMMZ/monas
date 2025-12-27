import { ref, h } from 'vue'
import {
  type DataTableColumns,
  type DataTableRowKey,
  NButton,
  NTooltip,
  type PaginationProps,
  type IconProps,
  createDiscreteApi,
} from 'naive-ui'
import type { ApiResult } from '@/network/types/request'
import { BaseService, type BaseEntity, type BaseQuery } from '@/network/service'
import type { PageResult } from '@/network/service'
import type { IconName } from '@/components/LucideIcon'
import { renderIcon } from './renderer'

const { message, dialog } = createDiscreteApi(['message', 'dialog'])

type SimplePaginationProps = Pick<
  PaginationProps,
  | 'page'
  | 'pageSize'
  | 'itemCount'
  | 'showSizePicker'
  | 'pageSizes'
  | 'pageCount'
  | 'onChange'
  | 'onUpdatePageSize'
  | 'showQuickJumper'
  | 'simple'
  | 'suffix'
  | 'prefix'
>

export type ActionHandler<T, K> = {
  key: K
  handler: (row: T, rowIndex: number, other?: unknown) => void
}
export type DataRow<T> = T & { editing?: boolean }

export function useTable<T extends BaseEntity, Q extends BaseQuery>(fetchData: () => void) {
  const tableData = ref<T[]>([])
  const queryParams = ref<Q>({} as Q)
  const checkedRowKeys = ref<DataTableRowKey[]>([])
  const tableLoading = ref(false)
  const totalElements = ref(0)
  const pagination = ref<SimplePaginationProps>({
    page: 1,
    pageSize: 10,
    showSizePicker: true,
    pageSizes: [5, 10, 20, 50, 100],
    prefix: () => h('span', `共 ${totalElements.value} 条`),
    suffix: () => h('span', { class: 'w-2' }),
    onChange: (page: number) => {
      pagination.value.page = page
      queryParams.value.pageNum = page
      fetchData()
    },
    onUpdatePageSize: (pageSize: number) => {
      pagination.value.pageSize = pageSize
      pagination.value.page = 1
      queryParams.value.pageNum = 1
      queryParams.value.pageSize = pageSize
      fetchData()
    },
  })

  function rowKey(row: T) {
    return row.id
  }

  function handleCheckedRowChange(rowKeys: DataTableRowKey[]) {
    checkedRowKeys.value = rowKeys
  }

  function handleFetchSuccess(response: ApiResult<PageResult<T>>) {
    tableData.value = response.data.content || []
    if (response.data) {
      totalElements.value = response.data.totalElements
      pagination.value.itemCount = response.data.totalElements
      pagination.value.pageCount = response.data.totalPages
    }
  }

  function query() {
    pagination.value.page = 1
    fetchData()
  }

  function reset() {
    queryParams.value = {} as Q
    pagination.value.page = 1
    fetchData()
  }

  function deleteAll(service: BaseService<T>) {
    if (checkedRowKeys.value.length > 0) {
      dialog.warning({
        title: '删除确认',
        content: `确定删除选中的 ${checkedRowKeys.value.length} 条记录吗？`,
        positiveText: '确认',
        negativeText: '取消',
        onPositiveClick: () => {
          service
            .deleteBatch(checkedRowKeys.value as number[])
            .then((res) => {
              if (res.code === 200) {
                message.success('删除成功')
                checkedRowKeys.value = []
                reset()
              }
            })
            .catch(() => message.error('删除失败'))
        },
      })
    } else {
      message.warning('请选择要删除的记录')
    }
  }

  return {
    tableData,
    queryParams,
    pagination,
    checkedRowKeys,
    tableLoading,
    rowKey,
    handleCheckedRowChange,
    handleFetchSuccess,
    query,
    reset,
    deleteAll,
  }
}

export interface TableAction<T> {
  label: MaybeFunction<T, string>
  type?: 'default' | 'tertiary' | 'primary' | 'info' | 'success' | 'warning' | 'error'
  icon: MaybeFunction<T, IconName>
  iconProps?: MaybeFunction<T, IconProps>
  handler: (row: T, rowIndex: number) => void
}
export type MaybeFunction<R, V> = V | ((row: R) => V)
export function toValueByRow<R, V>(value: MaybeFunction<R, V>, rowData: R): V {
  return typeof value === 'function' ? (value as (row: R) => V)(rowData) : value
}

export function handleTableActions<T>(columns: DataTableColumns<T>, actions?: TableAction<T>[]) {
  if (actions) {
    columns.push({
      title: '操作',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (rowData: T, rowIndex: number) =>
        h(
          'div',
          { class: 'flex gap-x-2' },
          actions.map((action) =>
            h(
              NTooltip,
              { trigger: 'hover' },
              {
                trigger: () =>
                  h(
                    NButton,
                    {
                      type: action.type,
                      size: 'small',
                      text: true,
                      onClick: () => action.handler(rowData, rowIndex),
                    },
                    {
                      icon: renderIcon(toValueByRow(action.icon, rowData), toValueByRow(action.iconProps, rowData)),
                    },
                  ),
                default: () => toValueByRow(action.label, rowData),
              },
            ),
          ),
        ),
    })
  }
}
