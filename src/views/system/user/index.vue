<template>
  <div class="h-full flex flex-col gap-y-1">
    <TableQuery>
      <n-form :key="queryFormKey" :model="queryParams" ref="queryParamsRef" size="small" label-placement="left"
        label-width="80px">
        <n-grid :x-gap="24">
          <n-form-item-gi :span="6" label="账号">
            <n-input v-model:value="queryParams.account" clearable />
          </n-form-item-gi>
          <n-form-item-gi :span="6" label="邮箱">
            <n-input v-model:value="queryParams.email" clearable />
          </n-form-item-gi>
          <n-form-item-gi :span="6" label="昵称">
            <n-input v-model:value="queryParams.nickname" clearable />
          </n-form-item-gi>
          <n-form-item-gi :span="6" label="状态">
            <n-select v-model:value="queryParams.status" :options="userStatusOptions" clearable />
          </n-form-item-gi>
          <n-form-item-gi :span="6" label="创建时间">
            <n-date-picker v-model:formatted-value="queryParams.createBetween" type="daterange" clearable
              value-format="yyyy-MM-dd" />
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </TableQuery>
    <TableToolbar>
      <n-button type="primary" size="small" :render-icon="renderIcon(Search)" @click="query">查询</n-button>
      <n-button type="warning" size="small" :render-icon="renderIcon(RefreshCw)" @click="reset">重置</n-button>
      <n-button type="info" size="small" :render-icon="renderIcon(Plus)">新增</n-button>
      <n-button type="error" size="small" :render-icon="renderIcon(Trash2)"
        @click="deleteAll(sysUserService)">删除</n-button>
    </TableToolbar>
    <div class="flex-1 pb-4">
      <n-data-table class="h-full" remote :row-key="rowKey" :columns="columns" :data="tableData"
        :checked-row-keys="checkedRowKeys" :loading="tableLoading" :pagination="pagination"
        @update-checked-row-keys="handleCheckedRowChange" />
    </div>

    <SaveModal ref="saveModalRef" @success="fetchData" />
  </div>
</template>

<script setup lang="ts">
import {
  NForm,
  NGrid,
  NFormItemGi,
  NInput,
  NSelect,
  NDatePicker,
  NButton,
  NDataTable,
  useMessage,
  useDialog
} from 'naive-ui'
import { ref, onMounted, useTemplateRef } from 'vue'
import { Search, RefreshCw, Plus, Trash2 } from 'lucide-vue-next'
import { userStatusOptions, getColumns, sysUserService } from './service'
import type { SysUser, SysUserQuery } from './types'
import { renderIcon } from '@/utils/renderer'
import { useTable } from '@/utils/table'
import TableQuery from '@/components/Table/TableQuery'
import TableToolbar from '@/components/Table/TableToolbar'
import SaveModal from './components/SaveModal.vue'
import { cloneDeep } from 'es-toolkit'

defineOptions({
  name: 'UserView',
})

const message = useMessage()
const dialog = useDialog()

const saveModalRef = useTemplateRef('saveModalRef')

const loading = ref({
  updateStatus: new Array<number>(),
})

const {
  rowKey,
  tableData,
  queryParams,
  queryFormKey,
  checkedRowKeys,
  tableLoading,
  pagination,
  query,
  reset,
  handleFetchSuccess,
  handleCheckedRowChange,
  deleteAll
} = useTable<SysUser, SysUserQuery>(fetchData)
const updateStatusMap = new Map([
  ['ACTIVE', { label: '封禁', icon: 'Ban', iconProps: { color: 'red' } }],
  ['DISABLED', { label: '解封', icon: 'Check', iconProps: { color: 'green' } }],
])
const columns = getColumns([
  {
    label: '编辑',
    type: 'info',
    icon: 'Edit',
    handler(row) {
      saveModalRef.value?.open(cloneDeep(row))
    },
  },
  {
    label: (row) => updateStatusMap.get(row.status)?.label || '',
    icon: (row) => updateStatusMap.get(row.status)?.icon || '',
    iconProps: (row) => updateStatusMap.get(row.status)?.iconProps || {},
    loading: (row) => loading.value.updateStatus.includes(row.id),
    handler: (row) => {
      dialog.warning({
        title: '确认操作',
        content: `确认${updateStatusMap.get(row.status)?.label || ''}用户${row.nickname || row.account}吗？`,
        positiveText: '确认',
        onPositiveClick: () => {
          const status = row.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE'
          loading.value.updateStatus.push(row.id)
          sysUserService.updateStatus(row.id, status).then(() => {
            message.success('操作成功')
            fetchData()
          }).finally(() => {
            loading.value.updateStatus = loading.value.updateStatus.filter((id) => id !== row.id)
          })
        }
      })
    }
  }
])

function fetchData() {
  tableLoading.value = true
  sysUserService.page(queryParams.value).then((res) => {
    handleFetchSuccess(res)
  }).finally(() => {
    tableLoading.value = false
  })
}

onMounted(() => {
  fetchData()
})
</script>
<style scoped></style>
