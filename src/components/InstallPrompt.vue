<script setup>
import { ref, onMounted } from 'vue'

const deferredPrompt = ref(null)
const showInstallBanner = ref(false)

onMounted(() => {
  // Listen for the browser's native install prompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome from automatically showing the prompt
    e.preventDefault()
    // Stash the event so it can be triggered later.
    deferredPrompt.value = e
    // Show your custom install banner/popup
    showInstallBanner.value = true
  })

  // Listen if the user successfully installs the app
  window.addEventListener('appinstalled', () => {
    showInstallBanner.value = false
    deferredPrompt.value = null
    console.log('PWA was installed successfully')
  })
})

const installApp = async () => {
  if (!deferredPrompt.value) return

  // Show the native installation prompt
  deferredPrompt.value.prompt()

  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.value.userChoice

  if (outcome === 'accepted') {
    console.log('User accepted the install prompt')
  } else {
    console.log('User dismissed the install prompt')
  }

  // Clear the saved prompt since it can't be used again
  deferredPrompt.value = null
  showInstallBanner.value = false
}

const dismissInstall = () => {
  showInstallBanner.value = false
}
</script>

<template>
  <div
    v-if="showInstallBanner"
    class="fixed top-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md z-50 bg-neutral-900 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4 border border-neutral-800 animate-slide-down"
  >
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
        <font-awesome-icon icon="fa-solid fa-download" class="text-white w-4 h-4" />
      </div>
      <div>
        <p class="text-xs sm:text-sm font-semibold">Install Shagun Enterprises</p>
        <p class="text-[11px] text-neutral-400">Install app on your phone for quick access & better experience.</p>
      </div>
    </div>

    <div class="flex items-center gap-2 shrink-0">
      <button
        @click="installApp"
        class="bg-white text-neutral-900 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-neutral-100 transition-colors cursor-pointer shadow-xs"
      >
        Install
      </button>
      <button
        @click="dismissInstall"
        class="text-neutral-400 hover:text-white p-1.5 text-xs font-medium cursor-pointer"
      >
        <font-awesome-icon icon="fa-solid fa-xmark" class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
