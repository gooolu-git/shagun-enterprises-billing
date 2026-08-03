<template>
  <header class="sticky top-0 z-50 px-3 pt-3 sm:px-4 transition-all duration-450">
    <div
      class="page-shell rounded-[1.75rem] border border-white/70 bg-white/82 shadow-[var(--shadow-sm)] backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-card/82"
    >
      <div class="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <!-- Brand Logo -->
        <router-link to="/" class="group flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#1a73e8_0%,#4285f4_55%,#34a853_100%)] text-white shadow-[var(--shadow-sm)] font-bold text-sm tracking-wider">
            SE
          </div>
          <div class="leading-tight">
            <div class="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-neutral-500/70">
              Shagun
            </div>
            <div class="text-base font-semibold tracking-[-0.03em] text-neutral-900 sm:text-lg">
              Enterprises
            </div>
          </div>
        </router-link>

        <!-- Navigation & User Profile -->
        <div class="flex items-center gap-2">
          <!-- Route Navigation -->
          <nav class="hidden md:flex items-center gap-1">
            <router-link
              to="/"
              class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              active-class="!bg-neutral-100 !text-neutral-900 shadow-2xs font-semibold"
            >
              <font-awesome-icon icon="fa-solid fa-house" class="h-4 w-4" />
              <span>Dashboard</span>
            </router-link>

            <router-link
              to="/customers"
              class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              active-class="!bg-neutral-100 !text-neutral-900 shadow-2xs font-semibold"
            >
              <font-awesome-icon icon="fa-solid fa-users" class="h-4 w-4" />
              <span>Sales</span>
            </router-link>

            <!-- Pending Dues Link -->
            <router-link
              to="/pending-payments"
              class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              active-class="!bg-amber-100/70 !text-amber-900 shadow-2xs font-semibold"
            >
              <font-awesome-icon icon="fa-solid fa-hand-holding-dollar" class="h-4 w-4 text-amber-500" />
              <span>Pending Dues</span>
              <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            </router-link>

            <router-link
              to="/analytics"
              class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
              active-class="!bg-neutral-100 !text-neutral-900 shadow-2xs font-semibold"
            >
              <font-awesome-icon icon="fa-solid fa-chart-line" class="h-4 w-4" />
              <span>Analytics</span>
            </router-link>
          </nav>

          <!-- User Profile Dropdown Menu -->
          <div class="relative" ref="dropdownRef">
            <button
              @click="isDropdownOpen = !isDropdownOpen"
              class="hidden sm:flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 shadow-xs hover:bg-neutral-50 transition-all cursor-pointer focus:outline-none"
              aria-haspopup="true"
              :aria-expanded="isDropdownOpen"
            >
              <div
                v-html="avatarSvg"
                class="w-6 h-6 rounded-full bg-neutral-100 border border-neutral-200 overflow-hidden [&>svg]:w-full [&>svg]:h-full shrink-0"
              ></div>
              <span class="text-xs font-medium text-neutral-700 max-w-[9rem] truncate">{{ userEmail }}</span>
              <font-awesome-icon icon="fa-solid fa-chevron-down" class="text-neutral-400 w-3 h-3 transition-transform duration-200" :class="{ 'rotate-180': isDropdownOpen }" />
            </button>

            <!-- Mobile Avatar Toggle Button -->
            <button
              @click="isDropdownOpen = !isDropdownOpen"
              class="sm:hidden flex items-center p-0.5 rounded-full hover:ring-2 hover:ring-neutral-200 transition-all cursor-pointer focus:outline-none"
            >
              <div
                v-html="avatarSvg"
                class="w-9 h-9 rounded-full bg-neutral-100 border border-neutral-200 overflow-hidden [&>svg]:w-full [&>svg]:h-full shadow-2xs"
              ></div>
            </button>

            <!-- Dropdown Card -->
            <Transition
              enter-active-class="transition duration-180 ease-out"
              enter-from-class="transform opacity-0 translate-y-2 scale-95"
              enter-to-class="transform opacity-100 translate-y-0 scale-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="transform opacity-100 translate-y-0 scale-100"
              leave-to-class="transform opacity-0 translate-y-2 scale-95"
            >
              <div
                v-if="isDropdownOpen"
                class="absolute right-0 mt-3 w-60 rounded-[1.5rem] border border-neutral-200/80 bg-white/98 p-2 shadow-xl backdrop-blur-xl z-50 divide-y divide-neutral-100"
              >
                <!-- User Information Header -->
                <div class="px-3 py-2.5 flex items-center gap-3">
                  <div
                    v-html="avatarSvg"
                    class="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 overflow-hidden [&>svg]:w-full [&>svg]:h-full shrink-0"
                  ></div>
                  <div class="truncate">
                    <p class="text-[0.68rem] text-neutral-400 font-semibold uppercase tracking-wider">Signed in as</p>
                    <p class="text-xs font-semibold text-neutral-900 truncate">
                      {{ userEmail }}
                    </p>
                  </div>
                </div>

                <!-- Route Links (Mobile & Dropdown unified) -->
                <div class="py-2 space-y-1">
                  <router-link
                    to="/"
                    @click="isDropdownOpen = false"
                    class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                  >
                    <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                      <font-awesome-icon icon="fa-solid fa-house" class="w-3.5 h-3.5" />
                    </div>
                    <span class="font-medium">Dashboard</span>
                  </router-link>

                  <router-link
                    to="/customers"
                    @click="isDropdownOpen = false"
                    class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                  >
                    <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                      <font-awesome-icon icon="fa-solid fa-users" class="w-3.5 h-3.5" />
                    </div>
                    <span class="font-medium">Sales</span>
                  </router-link>

                  <!-- Pending Dues Option -->
                  <router-link
                    to="/pending-payments"
                    @click="isDropdownOpen = false"
                    class="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                  >
                    <div class="flex items-center gap-3">
                      <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                        <font-awesome-icon icon="fa-solid fa-hand-holding-dollar" class="w-3.5 h-3.5" />
                      </div>
                      <span class="font-medium">Pending Dues</span>
                    </div>
                    <span class="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full">Ledger</span>
                  </router-link>

                  <router-link
                    to="/analytics"
                    @click="isDropdownOpen = false"
                    class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                  >
                    <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                      <font-awesome-icon icon="fa-solid fa-chart-line" class="w-3.5 h-3.5" />
                    </div>
                    <span class="font-medium">Analytics</span>
                  </router-link>
                </div>

                <!-- Logout Button -->
                <div class="pt-1">
                  <button
                    @click="handleSignOut"
                    class="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                  >
                    <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-red-600">
                      <font-awesome-icon icon="fa-solid fa-right-from-bracket" class="w-3.5 h-3.5" />
                    </div>
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Style, Avatar } from '@dicebear/core'
import avataaars from '@dicebear/styles/avataaars.json' with { type: 'json' }

const props = defineProps({
  session: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['signOut'])

const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

const userEmail = computed(() => {
  return props.session?.user?.email || 'admin@shagun.com'
})

// Instantiate DiceBear Style
const style = new Style(avataaars)

// Dynamic SVG avatar generated using the user's email as the seed
const avatarSvg = computed(() => {
  const avatar = new Avatar(style, {
    seed: userEmail.value,
    topProbability: 100,
    topVariant: ['shortFlat', 'shortWaved', 'shortRound', 'shavedSides', 'shortCurly'],
    hairColor: ['2c1b18', '4a312c', '724133', '000000'],
    facialHairProbability: 20,
    facialHairVariant: ['beardLight'],
    clothesVariant: ['blazerAndShirt', 'shirtCrewNeck', 'collarAndSweater'],
    clothesColor: ['262626', '3b82f6', '1e293b', '0284c7'],
    eyesVariant: ['default', 'happy', 'side'],
    eyebrowsVariant: ['defaultNatural', 'flatNatural'],
    mouthVariant: ['smile', 'default'],
    backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc']
  })

  return avatar.toString()
})

function handleSignOut() {
  isDropdownOpen.value = false
  emit('signOut')
}

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
