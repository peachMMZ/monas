<template>
  <div>
    <n-modal v-model:show="show" preset="card" draggable title="裁剪头像" :mask-closable="false" style="width: 600px"
      @close="handleClose">
      <div class="w-full h-full">
        <vue-cropper ref="cropperRef" :img="originalSrc" auto-crop fixed :fixed-number="[1, 1]" output-type="jpeg"
          style="height: 256px" />
      </div>
      <template #action>
        <div class="flex justify-end gap-x-2">
          <n-button type="default" @click="close">取消</n-button>
          <n-button type="primary" @click="onConfirm">确认</n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import {
  NModal,
  NButton
} from 'naive-ui'
import 'vue-cropper/dist/index.css'
import { VueCropper } from 'vue-cropper'

defineExpose({
  open,
})
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', blob: Blob): void
}>()

const show = ref(false)
const originalSrc = ref('')
const cropperRef = useTemplateRef('cropperRef')
function open(file: File) {
  originalSrc.value = URL.createObjectURL(file)
  show.value = true
}

function close() {
  show.value = false
  handleClose()
}
function handleClose() {
  if (originalSrc.value) {
    URL.revokeObjectURL(originalSrc.value)
  }
  emit('close')
}

function onConfirm() {
  if (!cropperRef.value) {
    return
  }
  cropperRef.value.getCropBlob((blob: Blob) => {
    emit('confirm', blob)
    close()
  })
}

</script>
<style scoped></style>
