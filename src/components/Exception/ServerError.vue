<template>
  <div class="h-full flex justify-center items-center">
    <NResult status="500" title="服务器错误" description="服务器出错可能说明该雇更多程序员了">
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
