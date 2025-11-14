<template>
  <component :is="icon" v-bind="props" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { icons, type LucideIconProps } from '.'

defineOptions({
  name: 'LucideIcon',
})

const props = defineProps<LucideIconProps>()

const icon = computed(() => icons[props.name as keyof typeof icons] as unknown)
</script>
<style scoped></style>
