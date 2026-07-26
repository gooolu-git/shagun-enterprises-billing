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
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 mb-4">
          <font-awesome-icon icon="fa-solid fa-receipt" class="text-xl" />
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Shagun Enterprises
        </h2>
        <p class="mt-2 text-sm text-slate-600">
          Sign in to access your billing ledger & POS system
        </p>
      </div>

      <!-- Card Container -->
      <div class="bg-white py-8 px-6 sm:px-8 shadow-xl shadow-slate-200/60 rounded-2xl border border-slate-100">
        <form class="space-y-5" @submit.prevent="handleLogin">
          <!-- Email Input -->
          <div>
            <label for="email" class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Email Address
            </label>
            <div class="relative rounded-lg shadow-sm">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <font-awesome-icon icon="fa-solid fa-envelope" class="text-slate-400 text-sm" />
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                placeholder="admin@shagun.com"
                class="block w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
              Password
            </label>
            <div class="relative rounded-lg shadow-sm">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <font-awesome-icon icon="fa-solid fa-lock" class="text-slate-400 text-sm" />
              </div>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                placeholder="••••••••"
                class="block w-full rounded-lg border border-slate-300 pl-10 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          <!-- Error Alert Banner -->
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div v-if="error" class="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200/80">
              <font-awesome-icon icon="fa-solid fa-circle-exclamation" class="text-red-500 flex-shrink-0" />
              <span>{{ error }}</span>
            </div>
          </Transition>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="group relative flex w-full justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <font-awesome-icon
              v-if="loading"
              icon="fa-solid fa-spinner"
              class="animate-spin text-white"
            />
            <span>{{ loading ? 'Signing in…' : 'Sign In to POS' }}</span>
            <font-awesome-icon
              v-if="!loading"
              icon="fa-solid fa-arrow-right"
              class="text-xs transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </form>
      </div>

      <!-- Footer Note -->
      <p class="text-center text-xs text-slate-500">
        Protected system &bull; Internal access only
      </p>
    </div>
  </div>
</template>
