<script setup>
import { useRegisterSW } from 'virtual:pwa-register/vue'

const {
  needRefresh,
  updateServiceWorker,
} = useRegisterSW()

const close = () => {
  needRefresh.value = false
}
</script>

<template>
  <div v-if="needRefresh" class="fixed bottom-4 right-4 z-50 bg-neutral-900 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-4 border border-neutral-800">
    <div>
      <p class="text-xs font-semibold">New version available!</p>
      <p class="text-[11px] text-neutral-400">Click update to get the latest features.</p>
    </div>
    <div class="flex items-center gap-2">
      <button
        @click="updateServiceWorker()"
        class="bg-white text-neutral-900 px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-neutral-100 transition-colors cursor-pointer"
      >
        Update
      </button>
      <button
        @click="close"
        class="text-neutral-400 hover:text-white px-2 py-1 text-xs font-medium cursor-pointer"
      >
        Close
      </button>
    </div>
  </div>
</template>
