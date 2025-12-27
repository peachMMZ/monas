<template>
  <div class="h-full flex flex-col gap-y-1">
    <table-query>
      <n-form :model="queryParams" ref="queryParamsRef" size="small" label-placement="left" label-width="80px">
        <n-grid :x-gap="24">
          <n-form-item-gi :span="6" label="任务名称">
            <n-input v-model:value="queryParams.name" clearable />
          </n-form-item-gi>
          <n-form-item-gi :span="6" label="任务描述">
            <n-input v-model:value="queryParams.description" clearable />
          </n-form-item-gi>
          <n-form-item-gi :span="6" label="Bean">
            <n-input v-model:value="queryParams.beanName" clearable />
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
        @click="deleteAll(taskService)">删除</n-button>
    </table-toolbar>
    <div class="flex-1 pb-4">
      <n-data-table class="h-full" remote :row-key="rowKey" :columns="columns" :data="tableData"
        :checked-row-keys="checkedRowKeys" :loading="tableLoading" :pagination="pagination"
        @update-checked-row-keys="handleCheckedRowChange" />
    </div>

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
  useMessage
} from 'naive-ui'
import { ref, onMounted } from 'vue'
import { Search, RefreshCw, Plus, Trash2 } from 'lucide-vue-next'
import { taskService, getColumns, enabledOptions } from './service'
import { useTable } from '@/utils/table'
import { renderIcon } from '@/utils/renderer'
import { cloneDeep } from 'es-toolkit'
import TableQuery from '@/components/Table/TableQuery'
import TableToolbar from '@/components/Table/TableToolbar'
import type { Task, TaskQuery } from './types'
import SaveModal from './components/SaveModal.vue'
import type { Optional } from '@/utils/type'

defineOptions({
  name: 'TaskView',
})

const message = useMessage()

const saveModalVisible = ref(false)
const saveModalDefaultData = {
  name: '',
  cron: '',
  beanName: undefined,
  enabled: true,
}
const saveModalData = ref<Optional<Task, 'id' | 'beanName'>>(saveModalDefaultData)
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
} = useTable<Task, TaskQuery>(fetchData)
const columns = getColumns([
  {
    label: '立即运行',
    icon: 'Zap',
    handler: (row) => {
      taskService.run(row.id).then((res) => {
        if (res.code === 200) {
          message.success('运行成功')
        } else {
          message.error(res.msg || '运行失败')
        }
      })
    }
  },
  {
    label: (row) => row.enabled ? '禁用' : '启用',
    icon: (row) => row.enabled ? 'Ban' : 'Play',
    handler: (row) => {
      taskService.toggleEnabled(row).then((res) => {
        if (res.code === 200) {
          message.success('操作成功')
        }
      })
    }
  },
  {
    label: '编辑',
    icon: 'Edit',
    handler: (row) => {
      saveModalData.value = cloneDeep(row)
      saveModalVisible.value = true
    }
  }
])

function fetchData() {
  tableLoading.value = true
  taskService.page(queryParams.value).then((res) => {
    handleFetchSuccess(res)
  }).finally(() => {
    tableLoading.value = false
  })
}

function add() {
  saveModalData.value = saveModalDefaultData
  saveModalVisible.value = true
}

onMounted(() => {
  query()
})
</script>
<style scoped></style>
