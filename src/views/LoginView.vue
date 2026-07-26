<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  loading.value = false

  if (signInError) {
    error.value = signInError.message
    return
  }

  router.push(route.query.redirect || '/')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-neutral-50">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-semibold text-neutral-900">Shagun Enterprises</h1>
        <p class="text-sm text-neutral-500 mt-1">Sign in to the billing ledger</p>
      </div>

      <form
        class="bg-white border border-neutral-200 rounded-md p-6 space-y-4"
        @submit.prevent="handleLogin"
      >
        <div>
          <label class="block text-xs uppercase tracking-wide text-neutral-500 mb-1.5" for="email">
            Email
          </label>
          <div class="relative">
            <font-awesome-icon
              icon="fa-solid fa-envelope"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm"
            />
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full border border-neutral-300 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs uppercase tracking-wide text-neutral-500 mb-1.5" for="password">
            Password
          </label>
          <div class="relative">
            <font-awesome-icon
              icon="fa-solid fa-lock"
              class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm"
            />
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="w-full border border-neutral-300 rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>
        </div>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white text-sm font-medium py-2.5 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <font-awesome-icon v-if="loading" icon="fa-solid fa-spinner" class="animate-spin" />
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
    </div>
  </div>
</template>
