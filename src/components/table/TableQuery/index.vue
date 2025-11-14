<template>
  <n-card size="small" embedded>
    <n-collapse>
      <n-collapse-item title="查询">
        <slot></slot>
      </n-collapse-item>
    </n-collapse>
  </n-card>
</template>

<script setup lang="ts">
import { NCard, NCollapse, NCollapseItem } from 'naive-ui'

defineOptions({
  name: 'TableQueryWrapper',
})
</script>
<style scoped></style>
