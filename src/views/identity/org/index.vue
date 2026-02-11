<template>
  <div class="h-full flex flex-col gap-y-1">
    <table-query>
      <n-form :key="queryFormKey" :model="queryParams" ref="queryParamsRef" size="small" label-placement="left"
        label-width="80px">
        <n-grid :x-gap="24">
          <n-form-item-gi :span="6" label="组织名称">
            <n-input v-model:value="queryParams.name" clearable />
          </n-form-item-gi>
          <n-form-item-gi :span="6" label="组织编码">
            <n-input v-model:value="queryParams.code" clearable />
          </n-form-item-gi>
          <n-form-item-gi :span="6" label="是否启用">
            <n-select :value="queryParams.enabled ? queryParams.enabled.toString() : undefined"
              :options="enabledOptions" clearable @update:value="(value) => queryParams.enabled = value === 'true'" />
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </table-query>
    <table-toolbar>
      <n-button type="primary" size="small" :render-icon="renderIcon(Search)" @click="query">查询</n-button>
      <n-button type="warning" size="small" :render-icon="renderIcon(RefreshCw)" @click="reset">重置</n-button>
      <n-button type="info" size="small" :render-icon="renderIcon(Plus)" @click="openSaveModal()">新增</n-button>
      <n-button type="error" size="small" :render-icon="renderIcon(Trash2)"
        @click="deleteAll(orgUnitService)">删除</n-button>
    </table-toolbar>
    <div class="flex-1 pb-4">
      <n-data-table class="h-full" :row-key="rowKey" :columns="columns" :data="treeData"
        :checked-row-keys="checkedRowKeys" :loading="tableLoading" @update-checked-row-keys="handleCheckedRowChange" />
    </div>

    <save-modal v-model:show="saveModalVisible" v-model:data="current" :parent-id="parentId" @success="onSaveSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  NButton,
  NForm,
  NGrid,
  NFormItemGi,
  NInput,
  NSelect,
  NDataTable,
} from 'naive-ui'
import { enabledOptions, getColumns, orgUnitService } from './service'
import { renderIcon } from '@/utils/renderer'
import { Search, RefreshCw, Plus, Trash2 } from 'lucide-vue-next'
import TableQuery from '@/components/Table/TableQuery'
import TableToolbar from '@/components/Table/TableToolbar'
import { useTable } from '@/utils/table'
import type { OrgUnit, OrgUnitQuery } from './types'
import type { Optional } from '@/utils/type'
import SaveModal from './components/SaveModal.vue'
import { cloneDeep } from 'es-toolkit'

defineOptions({
  name: 'OrgView',
})

const {
  rowKey,
  queryParams,
  queryFormKey,
  checkedRowKeys,
  tableLoading,
  query,
  reset,
  handleCheckedRowChange,
  deleteAll
} = useTable<OrgUnit, OrgUnitQuery>(fetchTreeData)

const columns = getColumns([
  {
    label: '编辑',
    icon: 'Edit',
    type: 'info',
    handler: (rowData) => {
      openSaveModal(cloneDeep(rowData))
    }
  },
  {
    label: '添加子组织',
    icon: 'PlusCircle',
    type: 'primary',
    handler: (rowData) => {
      parentId.value = rowData.id
      openSaveModal()
    }
  }
])

const treeData = ref<OrgUnit[]>([])
function fetchTreeData() {
  tableLoading.value = true
  orgUnitService.tree().then((res) => {
    treeData.value = res.data
  }).finally(() => {
    tableLoading.value = false
  })
}

const defaultFormData = (): Optional<OrgUnit, 'id'> => {
  const type: OrgUnit['type'] = 'COMPANY'
  const level = 0
  return {
    code: '',
    name: '',
    parentId: 1,
    type,
    path: '',
    sort: 0,
    level,
    enabled: true
  }
}
const saveModalVisible = ref(false)
const parentId = ref<number>()
const current = ref<Optional<OrgUnit, 'id'>>(defaultFormData())
function openSaveModal(row?: OrgUnit) {
  current.value = row ?? defaultFormData()
  saveModalVisible.value = true
}

function onSaveSuccess() {
  parentId.value = undefined
  fetchTreeData()
}

onMounted(() => {
  fetchTreeData()
})
</script>
<style scoped></style>
