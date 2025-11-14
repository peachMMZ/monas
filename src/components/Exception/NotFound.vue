<template>
  <div class="h-full flex justify-center items-center">
    <NResult status="404" title="404 资源不存在" description="生活总归带点荒谬">
      <template #footer>
        <n-button type="primary" secondary @click="$router.back">返回上一页</n-button>
      </template>
    </NResult>
  </div>
</template>

<script setup lang="ts">
import { NResult, NButton } from 'naive-ui'
</script>
<style scoped></style>
