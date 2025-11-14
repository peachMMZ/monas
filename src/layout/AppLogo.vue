<template>
  <div class="p-2 flex justify-center items-center">
    <transition name="logo-fade-slide" mode="out-in">
      <div :key="collapsed ? 1 : 0" class="flex items-center gap-x-2">
        <img v-if="collapsed" class="h-10" :src="Logo" alt="logo" />
        <div v-else class="flex items-center gap-x-2">
          <img class="h-8" :src="Logo" alt="logo" />
          <span :class="appNameClass">{{ appName }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import Logo from '@/assets/image/logo.svg'

defineProps<{
  collapsed?: boolean
}>()

const appName = import.meta.env.VITE_APP_NAME.toUpperCase()
const appNameClass =
  'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 text-3xl font-bold'
</script>

<style scoped>
/* 使用 mode="out-in" 保证切换前后不会同时出现，动画连贯 */
.logo-fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-10px) scale(0.95);
}

.logo-fade-slide-enter-to {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.logo-fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.logo-fade-slide-leave-to {
  opacity: 0;
  transform: translateX(10px) scale(0.95);
}

.logo-fade-slide-enter-active,
.logo-fade-slide-leave-active {
  transition: all 0.3s ease;
}
</style>
