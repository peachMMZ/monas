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
    <log-modal v-model:show="logModalVisible" :task="logModalTask" />
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
import LogModal from './components/LogModal.vue'
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
const loading = ref({
  run: new Array<number>(),
  toggleEnabled: new Array<number>(),
})
const columns = getColumns([
  {
    label: '立即运行',
    icon: 'Zap',
    iconProps: { color: 'orange' },
    loading: (row) => loading.value.run.includes(row.id),
    handler: async (row) => {
      loading.value.run.push(row.id)
      const res = await taskService.run(row.id)
      loading.value.run = loading.value.run.filter((id) => id !== row.id)
      if (res.code === 200) {
        message.success('运行成功')
      } else {
        message.error(res.msg || '运行失败')
      }
    }
  },
  {
    label: (row) => row.enabled ? '禁用' : '启用',
    icon: (row) => row.enabled ? 'Ban' : 'Play',
    iconProps: (row) => ({ color: row.enabled ? 'red' : 'green' }),
    loading: (row) => loading.value.toggleEnabled.includes(row.id),
    handler: async (row) => {
      loading.value.toggleEnabled.push(row.id)
      const res = await taskService.toggleEnabled(row)
      loading.value.toggleEnabled = loading.value.toggleEnabled.filter((id) => id !== row.id)
      if (res.code === 200) {
        message.success('操作成功')
      } else {
        message.error(res.msg || '操作失败')
      }
    }
  },
  {
    label: '编辑',
    icon: 'Edit',
    iconProps: { color: 'dodgerblue' },
    handler: (row) => {
      saveModalData.value = cloneDeep(row)
      saveModalVisible.value = true
    }
  },
  {
    label: '查看日志',
    icon: 'FileText',
    iconProps: { color: 'deepskyblue' },
    handler: openLogModal
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

const logModalVisible = ref(false)
const logModalTask = ref<Task>()
function openLogModal(task: Task) {
  logModalTask.value = task
  logModalVisible.value = true
}

onMounted(() => {
  query()
})
</script>
<style scoped></style>
