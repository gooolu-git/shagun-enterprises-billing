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
          @click="refreshAll"
          :disabled="loading"
          class="px-4 py-2.5 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
        >
          <font-awesome-icon icon="fa-solid fa-arrows-rotate" :class="{ 'animate-spin': loading }" />
          Refresh
        </button>

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
      <!-- 1. Total Revenue (Today) -->
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

      <!-- 2. Pending Dues (Total) -->
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

      <!-- 3. Sales Today -->
      <div class="p-6 bg-white border border-neutral-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <font-awesome-icon icon="fa-solid fa-circle-check" class="text-xl" />
          </div>
          <div>
            <p class="text-xs text-neutral-500 uppercase tracking-wider font-bold">Sales Today (Items)</p>
            <p class="text-2xl font-black text-neutral-900 mt-0.5">{{ dailySalesCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics Graphs Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Line Chart: 7-Day Trend -->
      <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col justify-between">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 class="text-base font-bold text-neutral-900">7-Day Sales Trend by Category</h2>
            <p class="text-xs text-neutral-500">Live DB metrics for Phones, Fridges, Washing Machines, and Others</p>
          </div>
          <div class="flex flex-wrap items-center gap-3 text-xs font-medium">
            <span class="inline-flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-blue-500"></span> Phones</span>
            <span class="inline-flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-indigo-400"></span> Fridges</span>
            <span class="inline-flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-teal-400"></span> Washing Machines</span>
            <span class="inline-flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-amber-400"></span> Other</span>
          </div>
        </div>

        <div class="relative h-64 w-full flex items-end pt-4 pb-2">
          <div class="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
            <div class="border-b border-dashed border-neutral-200 w-full"></div>
            <div class="border-b border-dashed border-neutral-200 w-full"></div>
            <div class="border-b border-dashed border-neutral-200 w-full"></div>
            <div class="border-b border-dashed border-neutral-200 w-full"></div>
          </div>

          <svg class="w-full h-52 overflow-visible z-10" viewBox="0 0 700 200" preserveAspectRatio="none">
            <path :d="phoneLinePath" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" class="transition-all duration-1000 ease-out" />
            <path :d="fridgeLinePath" fill="none" stroke="#818cf8" stroke-width="3" stroke-linecap="round" class="transition-all duration-1000 ease-out" />
            <path :d="washingLinePath" fill="none" stroke="#2dd4bf" stroke-width="3" stroke-linecap="round" class="transition-all duration-1000 ease-out" />
            <path :d="otherLinePath" fill="none" stroke="#fbbf24" stroke-width="3" stroke-linecap="round" class="transition-all duration-1000 ease-out" />
          </svg>
        </div>

        <div class="flex justify-between text-[11px] font-semibold text-neutral-400 pt-3 border-t border-neutral-100">
          <span v-for="(day, idx) in last7DaysLabels" :key="idx">{{ day }}</span>
        </div>
      </div>

      <!-- Donut / Pie Chart: Category Share -->
      <div class="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col justify-between">
        <div>
          <h2 class="text-base font-bold text-neutral-900">Category Share</h2>
          <p class="text-xs text-neutral-500">Distribution over Last 7 Days</p>
        </div>

        <div class="relative flex items-center justify-center py-6">
          <div class="relative w-44 h-44 flex items-center justify-center">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#f1f5f9" stroke-width="3.5" />
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#3b82f6" stroke-width="3.5" :stroke-dasharray="`${phoneShare} ${100 - phoneShare}`" stroke-dashoffset="0" class="transition-all duration-1000 ease-out" />
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#818cf8" stroke-width="3.5" :stroke-dasharray="`${fridgeShare} ${100 - fridgeShare}`" :stroke-dashoffset="`${-phoneShare}`" class="transition-all duration-1000 ease-out" />
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#2dd4bf" stroke-width="3.5" :stroke-dasharray="`${washingShare} ${100 - washingShare}`" :stroke-dashoffset="`${-(phoneShare + fridgeShare)}`" class="transition-all duration-1000 ease-out" />
              <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#fbbf24" stroke-width="3.5" :stroke-dasharray="`${otherShare} ${100 - otherShare}`" :stroke-dashoffset="`${-(phoneShare + fridgeShare + washingShare)}`" class="transition-all duration-1000 ease-out" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span class="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Mix</span>
              <span class="text-lg font-extrabold text-neutral-900">100%</span>
            </div>
          </div>
        </div>

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

// CARD METRICS
const dailyRevenue = ref(0)
const totalPending = ref(0)
const dailySalesCount = ref(0)

// GRAPH METRICS
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

// Helper: Local Date Formatter (YYYY-MM-DD)
function getLocalDateString(dateObj = new Date()) {
  return dateObj.toLocaleDateString('en-CA')
}

// Helper calculations for SVG chart lines
const last7DaysInfo = computed(() => {
  const info = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateString = getLocalDateString(d)
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

// ==========================================
// UNTOUCHED ORIGINAL DASHBOARD STATS LOGIC
// ==========================================
async function fetchDashboardStats() {
  loading.value = true
  try {
    const today = getLocalDateString(new Date())
    const startOfToday = new Date(`${today}T00:00:00`).toISOString()
    const endOfToday = new Date(`${today}T23:59:59.999`).toISOString()

    // 1. TOTAL SALES COUNT: Items created in sales table today
    const { count: salesCount, error: salesError } = await supabase
      .from('sales')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startOfToday)
      .lte('created_at', endOfToday)
      .eq('status', 'active')

    dailySalesCount.value = salesError ? 0 : (salesCount || 0)

    // 2. TOTAL REVENUE: Sum of money collected today in payments table
    const { data: todayPayments, error: paymentsError } = await supabase
      .from('payments')
      .select('amount_paid')
      .gte('created_at', startOfToday)
      .lte('created_at', endOfToday)

    if (!paymentsError && todayPayments) {
      dailyRevenue.value = todayPayments.reduce((sum, p) => sum + Number(p.amount_paid || 0), 0)
    } else {
      dailyRevenue.value = 0
    }

    // 3. PENDING DUES: Sum of all remaining balances across customer_dues view
    const { data: dues, error: duesError } = await supabase
      .from('customer_dues')
      .select('*')

    if (!duesError && dues) {
      totalPending.value = dues.reduce((sum, d) => sum + Number(d.total_due || 0), 0)
    } else {
      totalPending.value = 0
    }

    // 4. Update Trend Graph
    await fetchGraphLogic()

  } catch (err) {
    console.error('Error fetching dashboard stats:', err)
  } finally {
    loading.value = false
  }
}

// ==========================================
// UNTOUCHED ORIGINAL GRAPH LOGIC
// ==========================================
async function fetchGraphLogic() {
  const startDate = last7DaysInfo.value[0].dateString

  const { data: graphSales, error } = await supabase
    .from('sales')
    .select('price, item_category, sale_date, status')
    .gte('sale_date', startDate)
    .eq('status', 'active')

  if (!error && graphSales) {
    const pTrend = [0, 0, 0, 0, 0, 0, 0]
    const fTrend = [0, 0, 0, 0, 0, 0, 0]
    const wTrend = [0, 0, 0, 0, 0, 0, 0]
    const oTrend = [0, 0, 0, 0, 0, 0, 0]

    last7DaysInfo.value.forEach((dayInfo, index) => {
      const daySales = graphSales.filter(s => s.sale_date === dayInfo.dateString)
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
}

// ==========================================
// NEW SEPARATE FUNCTION: PIE CHART (7-DAY MIX)
// ==========================================
async function fetch7DayPieChartData() {
  try {
    const startDate = last7DaysInfo.value[0].dateString

    const { data: pieSales, error } = await supabase
      .from('sales')
      .select('price, item_category')
      .gte('sale_date', startDate)
      .eq('status', 'active')

    if (error || !pieSales || pieSales.length === 0) {
      phoneShare.value = 0
      fridgeShare.value = 0
      washingShare.value = 0
      otherShare.value = 0
      return
    }

    let phoneTotal = 0
    let fridgeTotal = 0
    let washingTotal = 0
    let otherTotal = 0

    pieSales.forEach(item => {
      const price = Number(item.price || 0)
      const cat = (item.item_category || '').toLowerCase()

      if (cat === 'phone') {
        phoneTotal += price
      } else if (cat === 'fridge') {
        fridgeTotal += price
      } else if (cat === 'washing_machine' || cat === 'washing machine') {
        washingTotal += price
      } else {
        otherTotal += price
      }
    })

    const grandTotal = phoneTotal + fridgeTotal + washingTotal + otherTotal

    if (grandTotal > 0) {
      phoneShare.value = Math.round((phoneTotal / grandTotal) * 100)
      fridgeShare.value = Math.round((fridgeTotal / grandTotal) * 100)
      washingShare.value = Math.round((washingTotal / grandTotal) * 100)
      otherShare.value = Math.max(0, 100 - (phoneShare.value + fridgeShare.value + washingShare.value))
    } else {
      phoneShare.value = 0
      fridgeShare.value = 0
      washingShare.value = 0
      otherShare.value = 0
    }
  } catch (err) {
    console.error('Error fetching 7-day pie chart data:', err)
  }
}

// Unified Refresh Trigger
async function refreshAll() {
  await fetchDashboardStats()
  await fetch7DayPieChartData()
}

onMounted(refreshAll)
</script>
