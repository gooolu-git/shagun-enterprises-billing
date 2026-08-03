<template>
  <div class="space-y-6 p-1 sm:p-2 pb-12">
    <!-- Greeting & Action Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">Welcome back, Admin</h1>
        <p class="text-xs sm:text-sm text-neutral-500 mt-0.5">Here is your daily summary for {{ formattedDate }}</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="fetchDashboardStats"
          :disabled="loading"
          class="px-3.5 py-2 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
        >
          <font-awesome-icon icon="fa-solid fa-arrows-rotate" :class="{ 'animate-spin': loading }" />
          Refresh
        </button>

        <!-- Redirects to the standalone Add Sale view page -->
        <router-link
          to="/add-sale"
          class="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-neutral-800 active:scale-[0.98] transition-all cursor-pointer shadow-md"
        >
          <font-awesome-icon icon="fa-solid fa-plus" />
          New Sale
        </router-link>
      </div>
    </div>

    <!-- Stats Grid (Compact & Narrower Widths) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
      <div class="p-4 bg-white border border-neutral-200/80 rounded-2xl shadow-xs hover:shadow-sm transition-shadow">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <font-awesome-icon icon="fa-solid fa-wallet" class="text-lg" />
          </div>
          <div>
            <p class="text-[11px] text-neutral-500 uppercase tracking-wider font-bold">Total Revenue (Today)</p>
            <p class="text-xl font-black text-neutral-900 mt-0.5">₹{{ dailyRevenue.toLocaleString('en-IN') }}</p>
          </div>
        </div>
      </div>

      <router-link to="/pending-payments" class="block group">
        <div class="p-4 bg-white border border-neutral-200/80 rounded-2xl shadow-xs group-hover:shadow-sm transition-shadow">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-red-50 text-red-600 rounded-xl">
              <font-awesome-icon icon="fa-solid fa-clock" class="text-lg" />
            </div>
            <div>
              <p class="text-[11px] text-neutral-500 uppercase tracking-wider font-bold">Pending Dues (Total)</p>
              <p class="text-xl font-black text-red-600 mt-0.5">₹{{ totalPending.toLocaleString('en-IN') }}</p>
            </div>
          </div>
        </div>
      </router-link>

      <div class="p-4 bg-white border border-neutral-200/80 rounded-2xl shadow-xs hover:shadow-sm transition-shadow">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <font-awesome-icon icon="fa-solid fa-circle-check" class="text-lg" />
          </div>
          <div>
            <p class="text-[11px] text-neutral-500 uppercase tracking-wider font-bold">Sales Today</p>
            <p class="text-xl font-black text-neutral-900 mt-0.5">{{ dailySalesCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics & Graphs Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Line Chart: 7-Day Category Sales Trend -->
      <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 class="text-base font-bold text-neutral-900">7-Day Sales Trend by Category</h2>
            <p class="text-xs text-neutral-500">Live DB metrics for Phones, Fridges, Washing Machines, and Others</p>
          </div>
          <!-- Category Legend -->
          <div class="flex flex-wrap items-center gap-3 text-xs font-medium">
            <span class="inline-flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-blue-500"></span> Phones</span>
            <span class="inline-flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-indigo-400"></span> Fridges</span>
            <span class="inline-flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-teal-400"></span> Washing Machines</span>
            <span class="inline-flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-amber-400"></span> Other</span>
          </div>
        </div>

        <!-- Animated SVG Line Chart -->
        <div class="relative h-64 w-full flex items-end pt-4 pb-2">
          <!-- Background Grid Lines -->
          <div class="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
            <div class="border-b border-dashed border-neutral-200 w-full"></div>
            <div class="border-b border-dashed border-neutral-200 w-full"></div>
            <div class="border-b border-dashed border-neutral-200 w-full"></div>
            <div class="border-b border-dashed border-neutral-200 w-full"></div>
          </div>

          <svg class="w-full h-52 overflow-visible z-10" viewBox="0 0 700 200" preserveAspectRatio="none">
            <!-- Phones Line -->
            <path :d="phoneLinePath" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" class="transition-all duration-1000 ease-out animate-fade-in" />
            <!-- Fridges Line -->
            <path :d="fridgeLinePath" fill="none" stroke="#818cf8" stroke-width="3" stroke-linecap="round" class="transition-all duration-1000 ease-out animate-fade-in" />
            <!-- Washing Machines Line -->
            <path :d="washingLinePath" fill="none" stroke="#2dd4bf" stroke-width="3" stroke-linecap="round" class="transition-all duration-1000 ease-out animate-fade-in" />
            <!-- Other Line -->
            <path :d="otherLinePath" fill="none" stroke="#fbbf24" stroke-width="3" stroke-linecap="round" class="transition-all duration-1000 ease-out animate-fade-in" />
          </svg>
        </div>

        <!-- X-Axis Labels -->
        <div class="flex justify-between text-[11px] font-semibold text-neutral-400 pt-3 border-t border-neutral-100">
          <span v-for="(day, idx) in last7DaysLabels" :key="idx">{{ day }}</span>
        </div>
      </div>

      <!-- Donut Chart: Category Proportionality Share -->
      <div class="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <h2 class="text-base font-bold text-neutral-900">Category Share</h2>
          <p class="text-xs text-neutral-500">Proportional revenue distribution</p>
        </div>

        <!-- Donut Visualizer -->
        <div class="relative flex items-center justify-center py-6">
          <div class="relative w-44 h-44 flex items-center justify-center">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f1f5f9" stroke-width="3.5" />
              <!-- Phones Segment -->
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#3b82f6" stroke-width="3.5" :stroke-dasharray="`${phoneShare} ${100 - phoneShare}`" stroke-dashoffset="0" class="transition-all duration-1000 ease-out" />
              <!-- Fridges Segment -->
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#818cf8" stroke-width="3.5" :stroke-dasharray="`${fridgeShare} ${100 - fridgeShare}`" :stroke-dashoffset="`${-phoneShare}`" class="transition-all duration-1000 ease-out" />
              <!-- Washing Machine Segment -->
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#2dd4bf" stroke-width="3.5" :stroke-dasharray="`${washingShare} ${100 - washingShare}`" :stroke-dashoffset="`${-(phoneShare + fridgeShare)}`" class="transition-all duration-1000 ease-out" />
              <!-- Other Segment -->
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#fbbf24" stroke-width="3.5" :stroke-dasharray="`${otherShare} ${100 - otherShare}`" :stroke-dashoffset="`${-(phoneShare + fridgeShare + washingShare)}`" class="transition-all duration-1000 ease-out" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span class="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Mix</span>
              <span class="text-lg font-extrabold text-neutral-900">100%</span>
            </div>
          </div>
        </div>

        <!-- Breakdown Legend with Percentages -->
        <div class="space-y-2 pt-2 border-t border-neutral-100 text-xs font-medium">
          <div class="flex items-center justify-between text-neutral-600">
            <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Phones</span>
            <span class="font-bold text-neutral-900">{{ phoneShare }}%</span>
          </div>
          <div class="flex items-center justify-between text-neutral-600">
            <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-indigo-400"></span> Fridges</span>
            <span class="font-bold text-neutral-900">{{ fridgeShare }}%</span>
          </div>
          <div class="flex items-center justify-between text-neutral-600">
            <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-teal-400"></span> Washing Machines</span>
            <span class="font-bold text-neutral-900">{{ washingShare }}%</span>
          </div>
          <div class="flex items-center justify-between text-neutral-600">
            <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Other</span>
            <span class="font-bold text-neutral-900">{{ otherShare }}%</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

const loading = ref(false)
const dailyRevenue = ref(0)
const totalPending = ref(0)
const dailySalesCount = ref(0)

const trendData = ref({
  phone: [0, 0, 0, 0, 0, 0, 0],
  fridge: [0, 0, 0, 0, 0, 0, 0],
  washing_machine: [0, 0, 0, 0, 0, 0, 0],
  other: [0, 0, 0, 0, 0, 0, 0]
})

const phoneShare = ref(0)
const fridgeShare = ref(0)
const washingShare = ref(0)
const otherShare = ref(0)

const formattedDate = new Date().toLocaleDateString('en-IN', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
})

const last7DaysInfo = computed(() => {
  const info = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateString = d.toISOString().split('T')[0]
    const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' })
    info.push({ dateString, label })
  }
  return info
})

const last7DaysLabels = computed(() => last7DaysInfo.value.map(i => i.label))

function createSvgPath(dataPoints) {
  if (!dataPoints || dataPoints.length === 0) return ''
  const max = Math.max(...dataPoints, 100)
  const width = 700
  const height = 180

  const points = dataPoints.map((val, index) => {
    const x = (index / (dataPoints.length - 1)) * width
    const y = height - (val / max) * height
    return { x, y }
  })

  return points.reduce((acc, pt, idx, arr) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`
    const prev = arr[idx - 1]
    const cpsX = (prev.x + pt.x) / 2
    return `${acc} C ${cpsX} ${prev.y}, ${cpsX} ${pt.y}, ${pt.x} ${pt.y}`
  }, '')
}

const phoneLinePath = computed(() => createSvgPath(trendData.value.phone))
const fridgeLinePath = computed(() => createSvgPath(trendData.value.fridge))
const washingLinePath = computed(() => createSvgPath(trendData.value.washing_machine))
const otherLinePath = computed(() => createSvgPath(trendData.value.other))

async function fetchDashboardStats() {
  loading.value = true
  try {
    const today = new Date().toISOString().split('T')[0]
    const startDate = last7DaysInfo.value[0].dateString

    // Fetch active sales from the past 7 days using your actual database columns
    const { data: salesData, error: salesError } = await supabase
      .from('sales')
      .select('price, paid_amount, item_category, sale_date, status')
      .gte('sale_date', startDate)
      .eq('status', 'active')

    if (!salesError && salesData) {
      const salesToday = salesData.filter(s => s.sale_date === today)
      dailyRevenue.value = salesToday.reduce((sum, s) => sum + Number(s.paid_amount || 0), 0)
      dailySalesCount.value = salesToday.length

      let pTotal = 0, fTotal = 0, wTotal = 0, oTotal = 0
      salesToday.forEach(s => {
        const amt = Number(s.price || 0)
        switch (s.item_category) {
          case 'phone': pTotal += amt; break;
          case 'fridge': fTotal += amt; break;
          case 'washing_machine': wTotal += amt; break;
          default: oTotal += amt; break;
        }
      })

      const grandTotal = pTotal + fTotal + wTotal + oTotal
      if (grandTotal > 0) {
        phoneShare.value = Math.round((pTotal / grandTotal) * 100)
        fridgeShare.value = Math.round((fTotal / grandTotal) * 100)
        washingShare.value = Math.round((wTotal / grandTotal) * 100)
        otherShare.value = 100 - (phoneShare.value + fridgeShare.value + washingShare.value)
      }

      const pTrend = [0, 0, 0, 0, 0, 0, 0]
      const fTrend = [0, 0, 0, 0, 0, 0, 0]
      const wTrend = [0, 0, 0, 0, 0, 0, 0]
      const oTrend = [0, 0, 0, 0, 0, 0, 0]

      last7DaysInfo.value.forEach((dayInfo, index) => {
        const daySales = salesData.filter(s => s.sale_date === dayInfo.dateString)
        daySales.forEach(s => {
          const val = Number(s.price || 0)
          if (s.item_category === 'phone') pTrend[index] += val
          else if (s.item_category === 'fridge') fTrend[index] += val
          else if (s.item_category === 'washing_machine') wTrend[index] += val
          else oTrend[index] += val
        })
      })

      trendData.value = {
        phone: pTrend,
        fridge: fTrend,
        washing_machine: wTrend,
        other: oTrend
      }
    }

    // Fetch total customer pending dues from your customer_dues view
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

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}
</style>
