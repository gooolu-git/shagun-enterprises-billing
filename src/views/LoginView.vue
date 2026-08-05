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
  <div class="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-100 via-neutral-50 to-blue-50/40 px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">

    <!-- Background Decorative Glow Elements -->
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>

    <div class="w-full max-w-md space-y-8 relative z-10">

      <!-- Main Content Container with Outer Border -->
      <div class="bg-white/90 backdrop-blur-xl p-8 sm:p-10 shadow-2xl shadow-neutral-200/60 rounded-3xl border-2 border-neutral-200/80 space-y-8">

        <!-- Brand Logo & Header -->
        <div class="text-center space-y-3">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-xl shadow-blue-500/10 border border-neutral-200/80 p-3 transform transition-transform hover:scale-105 duration-300">
            <img
              src="/pwa-192x192.png?v=2"
              alt="Shagun Enterprises Logo"
              class="w-full h-full object-contain drop-shadow-sm"
            />
          </div>

          <div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
              Shagun Enterprises
            </h2>
            <p class="mt-1.5 text-xs sm:text-sm font-medium text-neutral-500">
              Sign in to access your billing ledger & POS system
            </p>
          </div>
        </div>

        <!-- Form Section -->
        <form class="space-y-5" @submit.prevent="handleLogin">

          <!-- Email Input -->
          <div>
            <label for="email" class="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
              Email Address
            </label>
            <div class="relative rounded-xl shadow-sm">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <font-awesome-icon icon="fa-solid fa-envelope" class="text-neutral-400 text-sm" />
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                placeholder="admin@shagun.com"
                class="block w-full rounded-xl border border-neutral-300/80 bg-neutral-50/50 pl-10 pr-3 py-3 text-sm text-neutral-900 placeholder-neutral-400 transition-all focus:bg-white focus:border-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-900/10"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
              Password
            </label>
            <div class="relative rounded-xl shadow-sm">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <font-awesome-icon icon="fa-solid fa-lock" class="text-neutral-400 text-sm" />
              </div>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                placeholder="••••••••"
                class="block w-full rounded-xl border border-neutral-300/80 bg-neutral-50/50 pl-10 pr-3 py-3 text-sm text-neutral-900 placeholder-neutral-400 transition-all focus:bg-white focus:border-neutral-900 focus:outline-none focus:ring-4 focus:ring-neutral-900/10"
              />
            </div>
          </div>

          <!-- Error Alert Banner -->
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div v-if="error" class="flex items-center gap-2.5 rounded-xl bg-red-50 p-3.5 text-xs font-medium text-red-700 border border-red-200/80 shadow-sm">
              <font-awesome-icon icon="fa-solid fa-circle-exclamation" class="text-red-500 text-base flex-shrink-0" />
              <span>{{ error }}</span>
            </div>
          </Transition>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="group relative flex w-full justify-center items-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-bold text-white shadow-lg shadow-black/15 hover:bg-neutral-800 active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-neutral-900/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
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
              class="text-xs transition-transform group-hover:translate-x-1"
            />
          </button>
        </form>

        <!-- Footer Note -->
        <p class="text-center text-xs font-medium text-neutral-400 pt-2 border-t border-neutral-100">
          Protected system &bull; Internal access only
        </p>
      </div>

    </div>
  </div>
</template>

