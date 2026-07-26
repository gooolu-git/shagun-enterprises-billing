<template>
  <div class="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased">
    <Navbar v-if="session" :session="session" @signOut="signOut" />
    <main class="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar.vue'

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
