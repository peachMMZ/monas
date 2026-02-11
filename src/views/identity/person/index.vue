<template>
  <div class="h-full">
    <n-split :default-size="0.2" pane1-class="mr-1" pane2-class="ml-1" :min="0.2" :max="0.5">
      <template #1>
        <n-card class="h-full" title="组织">
          <org-tree @update:selected-keys="onOrgSelected" />
        </n-card>
      </template>
      <template #2>
        <div class="h-full flex flex-col gap-y-1">
          <table-query>
            <n-form :key="queryFormKey" :model="queryParams" ref="queryParamsRef" size="small" label-placement="left"
              label-width="80px">
              <n-grid :x-gap="24">
                <n-form-item-gi :span="6" label="姓名">
                  <n-input v-model:value="queryParams.name" clearable />
                </n-form-item-gi>
                <n-form-item-gi :span="6" label="工号">
                  <n-input v-model:value="queryParams.code" clearable />
                </n-form-item-gi>
                <n-form-item-gi :span="6" label="类型">
                  <n-select v-model:value="queryParams.type" :options="personTypes" clearable />
                </n-form-item-gi>
                <n-form-item-gi :span="6" label="状态">
                  <n-select v-model:value="queryParams.enabled" :options="enabledOptions" clearable />
                </n-form-item-gi>
              </n-grid>
            </n-form>
          </table-query>
          <table-toolbar>
            <n-button type="primary" size="small" :render-icon="renderIcon(Search)" @click="query">查询</n-button>
            <n-button type="warning" size="small" :render-icon="renderIcon(RefreshCw)" @click="reset">重置</n-button>
            <n-button type="info" size="small" :render-icon="renderIcon(Plus)" @click="add">新增</n-button>
            <n-button type="error" size="small" :render-icon="renderIcon(Trash2)"
              @click="deleteAll(personService)">删除</n-button>
          </table-toolbar>
          <div class="flex-1 pb-4">
            <n-data-table class="h-full" flex-height remote :row-key="rowKey" :columns="columns" :data="tableData"
              :checked-row-keys="checkedRowKeys" :loading="tableLoading" :pagination="pagination"
              @update-checked-row-keys="handleCheckedRowChange" />
          </div>
        </div>
      </template>
    </n-split>

    <save-modal v-model:show="saveModalVisible" :data="saveModalData" @success="query" />
  </div>
</template>

<script setup lang="ts">
import {
  NForm,
  NGrid,
  NFormItemGi,
  NInput,
  NSelect,
  NButton,
  NDataTable,
  NCard,
  NSplit,
} from 'naive-ui'
import { ref, onMounted } from 'vue'
import { Search, RefreshCw, Plus, Trash2 } from 'lucide-vue-next'
import { useTable } from '@/utils/table'
import { personService, enabledOptions, getColumns, personTypes } from './service'
import type { Person, PersonQuery } from './types'
import TableQuery from '@/components/Table/TableQuery'
import TableToolbar from '@/components/Table/TableToolbar'
import { renderIcon } from '@/utils/renderer'
import SaveModal from './components/SaveModal.vue'
import OrgTree from './components/OrgTree.vue'
import type { Optional } from '@/utils/type'
import dayjs from 'dayjs'
import { cloneDeep } from 'es-toolkit'
import { Feedback } from '@/utils/feedback'

defineOptions({
  name: 'PersonView'
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
} = useTable<Person, PersonQuery>(fetchData)

const columns = getColumns([
  {
    label: '编辑',
    type: 'info',
    icon: 'Edit',
    handler: (rowData) => {
      saveModalData.value = cloneDeep(rowData)
      saveModalVisible.value = true
    }
  }
])

function fetchData() {
  tableLoading.value = true
  personService.page(queryParams.value).then((res) => {
    handleFetchSuccess(res)
  }).finally(() => {
    tableLoading.value = false
  })
}

const defaultSaveModalData = (): Optional<Person, 'id'> => ({
  name: '',
  code: '',
  type: 'EMPLOYEE',
  joinDate: dayjs().format('YYYY-MM-DD'),
  mobile: '',
  enabled: true,
})
const saveModalVisible = ref(false)
const saveModalData = ref(defaultSaveModalData())
function add() {
  saveModalData.value = defaultSaveModalData()
  saveModalVisible.value = true
}

function onOrgSelected(keys: number[]) {
  // TODO 处理选中的组织单位
  const { message } = Feedback.getInstance()
  message.success(`选中的组织单位：${keys.join('、')}`)
}

onMounted(() => {
  query()
})
</script>
<style scoped></style>
