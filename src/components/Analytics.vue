<template>
  <div class="space-y-8 p-1 sm:p-2">
    <!-- Top Bar -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm">
      <div>
        <h1 class="text-2xl font-extrabold text-neutral-900 tracking-tight">Business Analytics</h1>
        <p class="text-sm text-neutral-500 mt-1">Deep-dive graphs, payment realizations, and category contributions</p>
      </div>

      <button
        @click="fetchAnalyticsData"
        :disabled="loading"
        class="px-4 py-2.5 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
      >
        <font-awesome-icon icon="fa-solid fa-arrows-rotate" :class="{ 'animate-spin': loading }" />
        Refresh Graphs
      </button>
    </div>

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Chart 1: Revenue vs Ledger Realization -->
      <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm space-y-4">
        <div>
          <h3 class="font-bold text-neutral-900 text-base">Billed Revenue vs Realized Cash</h3>
          <p class="text-xs text-neutral-500">Monthly comparison of total invoices against ledger payment receipts</p>
        </div>
        <div class="h-80 relative">
          <Bar v-if="!loading && chartDataTrend.labels.length" :data="chartDataTrend" :options="barChartOptions" />
          <div v-else class="h-full flex items-center justify-center text-xs text-neutral-400">
            <font-awesome-icon icon="fa-solid fa-spinner" class="animate-spin text-xl mr-2" />
            Generating trend graph...
          </div>
        </div>
      </div>

      <!-- Chart 2: Category Revenue Distribution -->
      <div class="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm space-y-4">
        <div>
          <h3 class="font-bold text-neutral-900 text-base">Category Performance</h3>
          <p class="text-xs text-neutral-500">Gross revenue generated per category</p>
        </div>
        <div class="h-80 relative flex items-center justify-center">
          <Doughnut v-if="!loading && chartDataCategory.labels.length" :data="chartDataCategory" :options="doughnutOptions" />
          <div v-else class="h-full flex items-center justify-center text-xs text-neutral-400">
            <font-awesome-icon icon="fa-solid fa-spinner" class="animate-spin text-xl mr-2" />
            Generating category breakdown...
          </div>
        </div>
      </div>
    </div>

    <!-- Automated Financial Insights -->
    <div class="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-sm space-y-4">
      <h3 class="text-xs font-bold text-neutral-400 uppercase tracking-wider">Automated Business Insights</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">

        <div class="p-4 bg-neutral-50 rounded-xl border border-neutral-200/60 flex items-start gap-3">
          <span class="p-2 bg-emerald-100 text-emerald-700 rounded-lg font-bold text-xs">1</span>
          <div>
            <p class="font-semibold text-neutral-900">Collection Recovery Rate</p>
            <p class="text-neutral-600 mt-1">
              You have realized <strong class="text-emerald-700">{{ collectionRate }}%</strong> of total billed revenue.
            </p>
          </div>
        </div>

        <div class="p-4 bg-neutral-50 rounded-xl border border-neutral-200/60 flex items-start gap-3">
          <span class="p-2 bg-blue-100 text-blue-700 rounded-lg font-bold text-xs">2</span>
          <div>
            <p class="font-semibold text-neutral-900">Top Revenue Category</p>
            <p class="text-neutral-600 mt-1">
              <strong class="capitalize text-neutral-900">{{ topCategory.name }}</strong> accounts for
              <strong>₹{{ topCategory.amount.toLocaleString('en-IN') }}</strong> of total sales.
            </p>
          </div>
        </div>

        <div class="p-4 bg-neutral-50 rounded-xl border border-neutral-200/60 flex items-start gap-3">
          <span class="p-2 bg-amber-100 text-amber-700 rounded-lg font-bold text-xs">3</span>
          <div>
            <p class="font-semibold text-neutral-900">Average Ticket Size</p>
            <p class="text-neutral-600 mt-1">
              Your average order value per item sold is <strong>₹{{ averageOrderValue.toLocaleString('en-IN') }}</strong>.
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

// Chart.js Registration
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js'
import { Bar, Doughnut } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

const loading = ref(false)
const grandTotalRevenue = ref(0)
const grandTotalCollected = ref(0)
const totalItemsSold = ref(0)
const topCategory = reactive({ name: 'N/A', amount: 0 })

const chartDataTrend = reactive({ labels: [], datasets: [] })
const chartDataCategory = reactive({ labels: [], datasets: [] })

const collectionRate = computed(() => {
  if (!grandTotalRevenue.value) return 0
  return Math.round((grandTotalCollected.value / grandTotalRevenue.value) * 100)
})

const averageOrderValue = computed(() => {
  if (!totalItemsSold.value) return 0
  return Math.round(grandTotalRevenue.value / totalItemsSold.value)
})

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' }
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: '#f3f4f6' }, beginAtZero: true }
  }
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' }
  }
}

async function fetchAnalyticsData() {
  loading.value = true
  try {
    const { data: sales } = await supabase
      .from('sales')
      .select('price, paid_amount, item_category, sale_date')
      .eq('status', 'active')

    const { data: payments } = await supabase
      .from('payments')
      .select('amount_paid, created_at')

    if (sales) {
      totalItemsSold.value = sales.length
      let revSum = 0
      let paidSum = 0
      const catMap = {}
      const monthlyTrend = {}

      sales.forEach(sale => {
        const price = Number(sale.price || 0)
        const paid = Number(sale.paid_amount || 0)

        revSum += price
        paidSum += paid

        const cat = sale.item_category || 'other'
        catMap[cat] = (catMap[cat] || 0) + price

        const monthKey = new Date(sale.sale_date).toLocaleString('en-IN', { month: 'short', year: '2-digit' })
        if (!monthlyTrend[monthKey]) {
          monthlyTrend[monthKey] = { sales: 0, payments: 0 }
        }
        monthlyTrend[monthKey].sales += price
      })

      if (payments) {
        payments.forEach(p => {
          const monthKey = new Date(p.created_at).toLocaleString('en-IN', { month: 'short', year: '2-digit' })
          if (monthlyTrend[monthKey]) {
            monthlyTrend[monthKey].payments += Number(p.amount_paid || 0)
          }
        })
      }

      grandTotalRevenue.value = revSum
      grandTotalCollected.value = paidSum

      let maxCat = { name: 'N/A', amount: 0 }
      Object.entries(catMap).forEach(([name, amount]) => {
        if (amount > maxCat.amount) maxCat = { name, amount }
      })
      topCategory.name = maxCat.name
      topCategory.amount = maxCat.amount

      const months = Object.keys(monthlyTrend)
      chartDataTrend.labels = months
      chartDataTrend.datasets = [
        {
          label: 'Billed Sales (₹)',
          backgroundColor: '#171717',
          data: months.map(m => monthlyTrend[m].sales)
        },
        {
          label: 'Realized Payments (₹)',
          backgroundColor: '#10b981',
          data: months.map(m => monthlyTrend[m].payments)
        }
      ]

      const categories = Object.keys(catMap)
      chartDataCategory.labels = categories.map(c => c.toUpperCase())
      chartDataCategory.datasets = [
        {
          backgroundColor: ['#171717', '#3b82f6', '#f59e0b', '#6b7280', '#10b981'],
          data: categories.map(c => catMap[c])
        }
      ]
    }
  } catch (err) {
    console.error('Analytics Fetch Error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchAnalyticsData)
</script>
