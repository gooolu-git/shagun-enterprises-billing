<template>
  <!-- Levitating Minimalist Mobile Bottom Dock (Visible on Mobile Only) matching the header theme -->
  <div class="fixed bottom-0 left-0 right-0 z-50 w-full pointer-events-none md:hidden pb-3 px-3">
    <div
      @mouseenter="isDockHovered = true"
      @mouseleave="() => { isDockHovered = false; hoveredDockIndex = null; }"
      class="dock-container pointer-events-auto h-16 px-4 w-full flex items-center justify-around rounded-[1.75rem] border border-white/70 bg-white/82 shadow-[0_-10px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:border-white/10 dark:bg-card/82"
    >
      <!-- Dock Items mapped from navigation and actions -->
      <template v-for="(item, i) in dockItems" :key="i">
        <router-link
          :to="item.to"
          @click="activeDockIndex = i"
          @mouseenter="hoveredDockIndex = i"
          class="relative flex flex-col items-center justify-center py-1.5 px-2.5 transition-all duration-300 group cursor-pointer"
        >
          <!-- Central Action Button (Floating Pill matching header styling) -->
          <div
            v-if="item.isAction"
            class="flex items-center justify-center w-11 h-11 -mt-6 rounded-2xl bg-[linear-gradient(135deg,#1a73e8_0%,#4285f4_55%,#34a853_100%)] text-white shadow-[var(--shadow-sm)] transition-transform duration-300 group-hover:scale-105"
          >
            <component :is="item.icon" class="w-5 h-5 stroke-[2.5]" />
          </div>

          <!-- Standard Navigation Items -->
          <template v-else>
            <component
              :is="item.icon"
              class="w-5 h-5 mb-1 transition-all duration-200"
              :class="[
                activeDockIndex === i || $route.path === item.to
                  ? `${item.color} stroke-[2.5]`
                  : 'text-neutral-400 stroke-[2] group-hover:text-neutral-700 dark:text-neutral-500 dark:group-hover:text-neutral-300'
              ]"
            />
            <span
              class="text-[10px] tracking-tight leading-none truncate max-w-[4rem] transition-all duration-200"
              :class="[
                activeDockIndex === i || $route.path === item.to
                  ? 'text-neutral-900 font-semibold dark:text-white'
                  : 'text-neutral-400 font-normal dark:text-neutral-500'
              ]"
            >
              {{ item.label }}
            </span>
          </template>

          <!-- Minimalist Active Indicator Dot -->
          <span
            v-if="!item.isAction && (activeDockIndex === i || $route.path === item.to)"
            class="absolute -bottom-0.5 w-1 h-1 rounded-full"
            :class="item.dotColor"
          ></span>
        </router-link>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Home, Users, Plus, Wallet, LineChart } from 'lucide-vue-next'

const isDockHovered = ref(false)
const hoveredDockIndex = ref(null)
const activeDockIndex = ref(0)

const dockItems = [
  { label: 'Dashboard', icon: Home, to: '/', color: 'text-blue-500 dark:text-blue-400', dotColor: 'bg-blue-500 dark:bg-blue-400' },
  { label: 'Sales', icon: Users, to: '/customers', color: 'text-indigo-500 dark:text-indigo-400', dotColor: 'bg-indigo-500 dark:bg-indigo-400' },
  { label: 'New Sale', icon: Plus, to: '/add-sale', isAction: true },
  { label: 'Pending Dues', icon: Wallet, to: '/pending-payments', color: 'text-amber-500 dark:text-amber-400', dotColor: 'bg-amber-500 dark:bg-amber-400' },
  { label: 'Analytics', icon: LineChart, to: '/analytics', color: 'text-emerald-500 dark:text-emerald-400', dotColor: 'bg-emerald-500 dark:bg-emerald-400' }
]
</script>
