<template>
  <header class="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur-md transition-all">
    <div class="mx-auto max-w-5xl px-6 py-3 flex items-center justify-between">
      <!-- Brand Logo -->
      <router-link to="/" class="flex items-center gap-2 group">
        <div class="p-2 bg-neutral-900 text-white rounded-lg font-bold text-xs tracking-wider group-hover:bg-neutral-800 transition-colors">
          SE
        </div>
        <span class="text-base font-bold text-neutral-900 tracking-tight">Shagun Enterprises</span>
      </router-link>

      <!-- Navigation & User Profile -->
      <div class="flex items-center gap-6">
        <!-- Route Navigation -->
        <nav class="hidden sm:flex items-center gap-1">
          <router-link
            to="/"
            class="px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all"
            active-class="!text-neutral-900 !bg-neutral-100 font-semibold"
          >
            Dashboard
          </router-link>
          <router-link
            to="/customers"
            class="px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all"
            active-class="!text-neutral-900 !bg-neutral-100 font-semibold"
          >
            Customers
          </router-link>

          <!-- Pending Dues Link -->
          <router-link
            to="/pending-payments"
            class="px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all flex items-center gap-1.5"
            active-class="!text-amber-900 !bg-amber-100/70 font-semibold"
          >
            <span>Pending Dues</span>
            <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          </router-link>

          <router-link
            to="/analytics"
            class="px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all"
            active-class="!text-neutral-900 !bg-neutral-100 font-semibold"
          >
            Analytics
          </router-link>
        </nav>

        <!-- User Profile Dropdown Menu -->
        <div class="relative" ref="dropdownRef">
          <button
            @click="isDropdownOpen = !isDropdownOpen"
            class="flex items-center p-0.5 rounded-full hover:ring-2 hover:ring-neutral-200 transition-all cursor-pointer focus:outline-none"
            aria-haspopup="true"
            :aria-expanded="isDropdownOpen"
          >
            <!-- DiceBear SVG Avatar Container (v-html) -->
            <div
              v-html="avatarSvg"
              class="w-9 h-9 rounded-full bg-neutral-100 border border-neutral-200 overflow-hidden [&>svg]:w-full [&>svg]:h-full shadow-2xs"
            ></div>
          </button>

          <!-- Dropdown Card -->
          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="transform scale-95 opacity-0 -translate-y-1"
            enter-to-class="transform scale-100 opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="transform scale-100 opacity-100 translate-y-0"
            leave-to-class="transform scale-95 opacity-0 -translate-y-1"
          >
            <div
              v-if="isDropdownOpen"
              class="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-neutral-200/80 shadow-lg py-2 z-50 divide-y divide-neutral-100"
            >
              <!-- User Information Header -->
              <div class="px-4 py-2.5 flex items-center gap-3">
                <div
                  v-html="avatarSvg"
                  class="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 overflow-hidden [&>svg]:w-full [&>svg]:h-full shrink-0"
                ></div>
                <div class="truncate">
                  <p class="text-xs text-neutral-400 font-medium">Signed in as</p>
                  <p class="text-xs font-semibold text-neutral-900 truncate">
                    {{ userEmail }}
                  </p>
                </div>
              </div>

              <!-- Route Links -->
              <div class="py-1">
                <router-link
                  to="/"
                  @click="isDropdownOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <font-awesome-icon icon="fa-solid fa-house" class="text-neutral-400 w-4" />
                  Dashboard
                </router-link>
                <router-link
                  to="/customers"
                  @click="isDropdownOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <font-awesome-icon icon="fa-solid fa-users" class="text-neutral-400 w-4" />
                  Customers
                </router-link>

                <!-- Pending Dues Option -->
                <router-link
                  to="/pending-payments"
                  @click="isDropdownOpen = false"
                  class="flex items-center justify-between px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <div class="flex items-center gap-2.5">
                    <font-awesome-icon icon="fa-solid fa-hand-holding-dollar" class="text-amber-500 w-4" />
                    <span>Pending Dues</span>
                  </div>
                  <span class="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full">Ledger</span>
                </router-link>

                <router-link
                  to="/analytics"
                  @click="isDropdownOpen = false"
                  class="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <font-awesome-icon icon="fa-solid fa-chart-line" class="text-neutral-400 w-4" />
                  Analytics
                </router-link>
              </div>

              <!-- Logout Button -->
              <div class="py-1">
                <button
                  @click="handleSignOut"
                  class="w-full flex items-center gap-2.5 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                >
                  <font-awesome-icon icon="fa-solid fa-right-from-bracket" class="w-4" />
                  Sign out
                </button>
              </div>
            </div>
          </Transition>
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
