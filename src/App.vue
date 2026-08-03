<template>
  <div class="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased flex flex-col justify-between">
    <Navbar v-if="session" :session="session" @signOut="signOut" />

    <!-- Added pb-24 to ensure content doesn't get hidden behind the floating mobile dock -->
    <main class="mx-auto max-w-5xl px-4 sm:px-6 py-8 flex-1 pb-24">
      <router-view />
    </main>

    <!-- Levitating macOS/VisionOS Mobile Dock (Visible on mobile screens only via md:hidden) -->
    <MobileDock v-if="session" />

    <ReloadPrompt />
    <InstallPrompt />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar.vue'
import MobileDock from '@/components/MobileDock.vue'
import ReloadPrompt from '@/components/ReloadPrompt.vue'
import InstallPrompt from '@/components/InstallPrompt.vue'

const router = useRouter()
const session = ref(null)
let authListener

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  session.value = data.session

  const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
    session.value = newSession
  })
  authListener = listener
})

onUnmounted(() => {
  authListener?.subscription?.unsubscribe()
})

async function signOut() {
  await supabase.auth.signOut()
  router.push({ name: 'login' })
}
</script>
