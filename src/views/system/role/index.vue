<template>
  <div class="h-full flex flex-col gap-y-1">
    <table-query>
      <n-form :key="queryFormKey" :model="queryParams" size="small" label-placement="left" label-width="80px">
        <n-grid :x-gap="24">
          <n-form-item-gi :span="6" label="角色编码">
            <n-input v-model:value="queryParams.roleCode" clearable />
          </n-form-item-gi>
          <n-form-item-gi :span="6" label="角色名称">
            <n-input v-model:value="queryParams.roleName" clearable />
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </table-query>
    <table-toolbar>
      <n-button type="primary" size="small" :render-icon="renderIcon(Search)" @click="query">查询</n-button>
      <n-button type="warning" size="small" :render-icon="renderIcon(RefreshCw)" @click="reset">重置</n-button>
      <n-button type="info" size="small" :render-icon="renderIcon(Plus)" @click="add">新增</n-button>
      <n-button type="error" size="small" :render-icon="renderIcon(Trash2)"
        @click="deleteAll(sysRoleService)">删除</n-button>
    </table-toolbar>
    <div class="flex-1 pb-4">
      <n-data-table class="h-full" remote :row-key="rowKey" :columns="columns" :data="tableData"
        :checked-row-keys="checkedRowKeys" :loading="tableLoading" :pagination="pagination"
        @update-checked-row-keys="handleCheckedRowChange" />
    </div>

    <save-modal ref="saveModalRef" @success="query" />
    <menu-modal ref="menuModalRef" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import {
  NForm,
  NGrid,
  NFormItemGi,
  NInput,
  NButton,
  NDataTable
} from 'naive-ui'
import { Search, RefreshCw, Plus, Trash2 } from 'lucide-vue-next'
import TableQuery from '@/components/Table/TableQuery'
import TableToolbar from '@/components/Table/TableToolbar'
import { getColumns, sysRoleService } from './service'
import { useTable } from '@/utils/table'
import { cloneDeep } from 'es-toolkit'
import type { SysRole, SysRoleQuery } from './types'
import { renderIcon } from '@/utils/renderer'
import SaveModal from './components/SaveModal.vue'
import MenuModal from './components/MenuModal.vue'

defineOptions({
  name: 'RoleIndex',
})

const {
  rowKey,
  tableData,
  queryFormKey,
  queryParams,
  checkedRowKeys,
  tableLoading,
  pagination,
  query,
  reset,
  handleFetchSuccess,
  handleCheckedRowChange,
  deleteAll
} = useTable<SysRole, SysRoleQuery>(fetchData)
const columns = getColumns([
  {
    label: '编辑',
    type: 'info',
    icon: 'Edit',
    handler: (row) => {
      saveModalRef.value?.open(cloneDeep(row))
    }
  },
  {
    label: '分配菜单',
    type: 'warning',
    icon: 'Menu',
    hidden: (row) => row.menuScope === 'ALL',
    handler: (row) => {
      assignMenu(row)
    }
  }
])

function fetchData() {
  tableLoading.value = true
  sysRoleService.page({
    ...queryParams.value,
    sortBy: 'createdDate',
    order: 'desc'
  }).then((res) => {
    handleFetchSuccess(res)
  }).finally(() => {
    tableLoading.value = false
  })
}

const saveModalRef = useTemplateRef('saveModalRef')

function add() {
  saveModalRef.value?.open()
}

const menuModalRef = useTemplateRef('menuModalRef')
function assignMenu(row: SysRole) {
  menuModalRef.value?.open(row)
}

onMounted(() => {
  query()
})
</script>
<style scoped></style>
