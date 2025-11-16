<!-- filepath: src/components/PageLoader.vue -->
<template>
  <Transition name="fade">
    <div 
      v-if="isLoading"
      class="fixed inset-0 bg-white/80 backdrop-blur-sm z-[9999] flex items-center justify-center"
    >
      <div class="flex flex-col items-center gap-4">
        <!-- Spinner Animation -->
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 rounded-full border-4 border-slate-200"></div>
          <div 
            class="absolute inset-0 rounded-full border-4 border-transparent border-t-slate-900 border-r-slate-900 animate-spin"
          ></div>
        </div>
        
        <!-- Loading Text -->
        <p class="text-slate-700 font-medium text-lg">Chargement...</p>
        
        <!-- Optional Progress Bar -->
        <div class="w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-slate-900 to-slate-700 rounded-full transition-all duration-500"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isLoading = ref(false)
const progress = ref(0)

let progressInterval: NodeJS.Timeout | null = null

const startLoading = () => {
  isLoading.value = true
  progress.value = 0
  
  progressInterval = setInterval(() => {
    progress.value += Math.random() * 30
    if (progress.value > 90) progress.value = 90
  }, 200)
}

const stopLoading = () => {
  progress.value = 100
  if (progressInterval) clearInterval(progressInterval)
  
  setTimeout(() => {
    isLoading.value = false
    progress.value = 0
  }, 300)
}

// Expose methods globally
defineExpose({
  startLoading,
  stopLoading,
})

onUnmounted(() => {
  if (progressInterval) clearInterval(progressInterval)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>