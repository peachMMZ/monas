<template>
  <n-card size="small" embedded>
    <div class="flex justify-between">
      <div class="flex justify-start items-center gap-x-2">
        <slot></slot>
      </div>
      <div class="flex justify-end items-center gap-x-2">
        <slot name="extra"></slot>
      </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { NCard } from 'naive-ui'

defineOptions({
  name: 'TableToolbar',
})
</script>
<style scoped></style>
