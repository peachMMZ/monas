<template>
  <div class="h-full flex flex-col gap-y-1">
    <TableQuery>
      <n-form :model="queryParams" ref="queryParamsRef" size="small" label-placement="left" label-width="80px">
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
        @click="deleteAll(userService)">删除</n-button>
    </TableToolbar>
    <div class="flex-1 pb-4">
      <n-data-table class="h-full" remote :row-key="rowKey" :columns="columns" :data="tableData"
        :checked-row-keys="checkedRowKeys" :loading="tableLoading" :pagination="pagination"
        @update-checked-row-keys="handleCheckedRowChange" />
    </div>
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
  NDataTable
} from 'naive-ui'
import { onMounted } from 'vue'
import { Search, RefreshCw, Plus, Trash2 } from 'lucide-vue-next'
import { userStatusOptions, getColumns, userService } from './service'
import type { User, UserQuery } from './types'
import { renderIcon } from '@/utils/renderer'
import { useTable } from '@/utils/table'
import TableQuery from '@/components/Table/TableQuery'
import TableToolbar from '@/components/Table/TableToolbar'

defineOptions({
  name: 'UserView',
})

const {
  rowKey,
  tableData,
  queryParams,
  checkedRowKeys,
  tableLoading,
  pagination,
  query,
  reset,
  handleFetchSuccess,
  handleCheckedRowChange,
  deleteAll
} = useTable<User, UserQuery>(fetchData)
const columns = getColumns([
  {
    label: '编辑',
    type: 'info',
    icon: 'Edit',
    handler(row, rowIndex) {
      console.log(row, rowIndex)
    },
  },
  {
    label: '分配角色',
    type: 'warning',
    icon: 'Users',
    handler(row, rowIndex) {
      console.log(row, rowIndex)
    },
  }
])

function fetchData() {
  tableLoading.value = true
  userService.page(queryParams.value).then((res) => {
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
