<template>
  <div>
    <n-modal v-model:show="show" preset="card" draggable style="width: 480px;" @close="reset">
      <template #header>
        <div class="flex justify-start items-center gap-x-2">
          <span>任务日志</span>
          <n-button type="primary" text :render-icon="renderIcon(RefreshCw)" :loading="loading"
            @click="refresh"></n-button>
        </div>
      </template>
      <div class="mb-4 flex justify-end items-center gap-x-2">
        <div class="basis-1/3">
          <n-select v-model:value="queryParams.status" size="small" :options="taskStatusOptions" clearable
            placeholder="请选择状态" @update:value="refresh" />
        </div>
        <div class="basis-2/3">
          <n-date-picker v-model:formatted-value="queryParams.createdDateBetween" size="small" type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss" clearable placeholder="请选择时间范围" @update:formatted-value="refresh" />
        </div>
      </div>
      <n-infinite-scroll :distance="10" style="height: 360px;" @load="loadMore">
        <n-timeline>
          <n-timeline-item v-for="item in timelineItems" :key="item.time" :type="item.type" :time="item.time"
            :title="item.title" :content="item.content" />
        </n-timeline>
        <div v-if="noMore" class="mt-4 text-center text-gray-400">没有更多了</div>
      </n-infinite-scroll>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  NModal,
  NTimeline,
  NTimelineItem,
  NInfiniteScroll,
  NButton,
  NSelect,
  NDatePicker
} from 'naive-ui'
import { RefreshCw } from 'lucide-vue-next'
import type { Task, TaskLog, TaskLogQuery, TaskStatus } from '../types'
import { taskLogService, taskStatusOptions } from '../service'
import { renderIcon } from '@/utils/renderer'

const props = defineProps<{
  task?: Task
}>()

const show = defineModel('show', { default: false })

const page = ref(0)
const totalPages = ref(Infinity)
const loading = ref(false)
const noMore = computed(() => page.value >= totalPages.value)
const queryParams = ref<TaskLogQuery>({})
const logs = ref<TaskLog[]>([])
function fetchLogs(loadMore = false) {
  if (!props.task || loading.value) {
    return
  }
  loading.value = true
  taskLogService.page({
    ...queryParams.value,
    taskId: props.task.id,
    sortBy: 'createdDate',
    order: 'desc',
    pageNum: page.value
  }).then((res) => {
    if (res.code === 200) {
      const content = res.data.content || []
      if (loadMore) {
        logs.value.push(...content)
      } else {
        logs.value = content
      }
      totalPages.value = res.data.totalPages || 0
    }
  }).finally(() => {
    loading.value = false
  })
}
function loadMore() {
  console.log('loadMore', page.value, totalPages.value)
  if (loading.value || page.value >= totalPages.value) {
    return
  }
  page.value++
  fetchLogs(true)
}

const statusMap = new Map<TaskStatus, { color: 'default' | 'success' | 'info' | 'warning' | 'error', title: string }>([
  ['SUCCESS', { color: 'success', title: '成功' }],
  ['FAILED', { color: 'error', title: '失败' }],
  ['RUNNING', { color: 'info', title: '运行中' }],
  ['INTERRUPTED', { color: 'warning', title: '已中断' }],
  ['LOST', { color: 'error', title: '已丢失' }],
])
const timelineItems = computed(() => {
  return logs.value.map((log) => ({
    time: log.startTime,
    type: statusMap.get(log.status)?.color || 'default',
    title: statusMap.get(log.status)?.title || '未知',
    content: log.errorMessage || '执行成功' + (log.duration ? `，耗时 ${log.duration} 毫秒` : '')
  }))
})

function reset() {
  page.value = 0
  totalPages.value = Infinity
  logs.value = []
}

function refresh() {
  reset()
  fetchLogs(false)
}

watch(() => show.value, (newShow) => {
  if (newShow) {
    fetchLogs(false)
  }
})
</script>
<style scoped></style>
