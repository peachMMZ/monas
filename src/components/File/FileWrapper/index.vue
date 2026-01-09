<template>
  <slot :file-url="fileUrl"></slot>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { fileService } from '@/services/file'

defineOptions({
  name: 'FileWrapper',
})
const props = defineProps<{
  fileId?: string
}>()

const fileUrl = ref('')
async function fetchFileUrl() {
  if (!props.fileId) {
    fileUrl.value = ''
    return
  }
  const res = await fileService.url(props.fileId)
  if (res.code === 200) {
    fileUrl.value = res.data
  }
}

watch(() => props.fileId, fetchFileUrl, { immediate: true })
</script>
<style scoped></style>
