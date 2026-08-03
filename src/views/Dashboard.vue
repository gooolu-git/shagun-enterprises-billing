<template>
  <div class="space-y-8 p-1 sm:p-2">
    <!-- Greeting & Action Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm">
      <div>
        <h1 class="text-2xl font-extrabold text-neutral-900 tracking-tight">Welcome back, Admin</h1>
        <p class="text-sm text-neutral-500 mt-1">Here is your daily summary for {{ formattedDate }}</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="fetchDashboardStats"
          :disabled="loading"
          class="px-4 py-2.5 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
        >
          <font-awesome-icon icon="fa-solid fa-arrows-rotate" :class="{ 'animate-spin': loading }" />
          Refresh
        </button>

        <!-- Redirects to the standalone Add Sale view page -->
        <router-link
          to="/add-sale"
          class="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 active:scale-[0.98] transition-all cursor-pointer shadow-md"
        >
          <font-awesome-icon icon="fa-solid fa-plus" />
          New Sale
        </router-link>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="p-6 bg-white border border-neutral-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
            <font-awesome-icon icon="fa-solid fa-wallet" class="text-xl" />
          </div>
          <div>
            <p class="text-xs text-neutral-500 uppercase tracking-wider font-bold">Total Revenue (Today)</p>
            <p class="text-2xl font-black text-neutral-900 mt-0.5">₹{{ dailyRevenue.toLocaleString('en-IN') }}</p>
          </div>
        </div>
      </div>
      <router-link to="/pending-payments">
      <div class="p-6 bg-white border border-neutral-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="p-3.5 bg-red-50 text-red-600 rounded-xl">
            <font-awesome-icon icon="fa-solid fa-clock" class="text-xl" />
          </div>
          <div>
            <p class="text-xs text-neutral-500 uppercase tracking-wider font-bold">Pending Dues (Total)</p>
            <p class="text-2xl font-black text-red-600 mt-0.5">₹{{ totalPending.toLocaleString('en-IN') }}</p>
          </div>
        </div>
      </div>
      </router-link>

      <div class="p-6 bg-white border border-neutral-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <font-awesome-icon icon="fa-solid fa-circle-check" class="text-xl" />
          </div>
          <div>
            <p class="text-xs text-neutral-500 uppercase tracking-wider font-bold">Sales Today</p>
            <p class="text-2xl font-black text-neutral-900 mt-0.5">{{ dailySalesCount }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

const loading = ref(false)
const dailyRevenue = ref(0)
const totalPending = ref(0)
const dailySalesCount = ref(0)

const formattedDate = new Date().toLocaleDateString('en-IN', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
})

async function fetchDashboardStats() {
  loading.value = true
  try {
    const today = new Date().toISOString().split('T')[0]

    const { data: salesToday, error: salesError } = await supabase
      .from('sales')
      .select('paid_amount')
      .eq('sale_date', today)

    if (!salesError && salesToday) {
      dailyRevenue.value = salesToday.reduce((sum, s) => sum + Number(s.paid_amount || 0), 0)
      dailySalesCount.value = salesToday.length
    }

    const { data: dues, error: duesError } = await supabase
      .from('customer_dues')
      .select('total_due')

    if (!duesError && dues) {
      totalPending.value = dues.reduce((sum, d) => sum + Number(d.total_due || 0), 0)
    }
  } catch (err) {
    console.error('Error fetching dashboard stats:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchDashboardStats)
</script>
