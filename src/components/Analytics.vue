<template>
  <div class="space-y-6 p-1 sm:p-2 pb-12">
    <!-- Greeting & Action Header -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-xs">
      <div>
        <h1 class="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">Business Analytics</h1>
        <p class="text-xs sm:text-sm text-neutral-500 mt-0.5">Deep-dive graphs, payment realizations, and category
          contributions</p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <!-- Month & Year Report Selector Controls -->
        <div class="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 shadow-xs">
          <select v-model="selectedMonth"
            class="bg-transparent text-xs sm:text-sm font-semibold text-neutral-800 outline-none cursor-pointer">
            <option v-for="m in 12" :key="m" :value="m">{{ new Date(0, m - 1).toLocaleString('default', {
              month: 'short'
              }) }}</option>
          </select>
          <select v-model="selectedYear"
            class="bg-transparent text-xs sm:text-sm font-semibold text-neutral-800 outline-none cursor-pointer">
            <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
          </select>
          <button @click="triggerMonthlyReport" :disabled="loadingReport"
            class="ml-2 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
            title="Download PDF Financial Report">
            <font-awesome-icon icon="fa-solid fa-file-arrow-down" :class="{ 'animate-bounce': loadingReport }" />
            {{ loadingReport ? 'Downloading...' : 'Download Report' }}
          </button>
        </div>

        <button @click="fetchAnalyticsData" :disabled="loading"
          class="px-3.5 py-2 border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer">
          <font-awesome-icon icon="fa-solid fa-arrows-rotate" :class="{ 'animate-spin': loading }" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Charts Grid (Row 1: Main Trends & Category Share) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Chart 1: Revenue vs Ledger Realization -->
      <div
        class="lg:col-span-2 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
        <div class="mb-6">
          <h2 class="text-base font-bold text-neutral-900">Billed Revenue vs Realized Cash</h2>
          <p class="text-xs text-neutral-500">Monthly comparison of total invoices against ledger payment receipts</p>
        </div>
        <div class="h-72 relative">
          <Bar v-if="!loading && chartDataTrend.labels.length" :data="chartDataTrend" :options="barChartOptions" />
          <div v-else class="h-full flex items-center justify-center text-xs text-neutral-400">
            <font-awesome-icon icon="fa-solid fa-spinner" class="animate-spin text-xl mr-2" />
            Generating trend graph...
          </div>
        </div>
      </div>

      <!-- Chart 2: Category Revenue Distribution -->
      <div class="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
        <div class="mb-4">
          <h2 class="text-base font-bold text-neutral-900">Category Performance</h2>
          <p class="text-xs text-neutral-500">Gross revenue generated per category</p>
        </div>
        <div class="h-60 relative flex items-center justify-center my-2">
          <Doughnut v-if="!loading && chartDataCategory.labels.length" :data="chartDataCategory"
            :options="doughnutOptions" />
          <div v-else class="h-full flex items-center justify-center text-xs text-neutral-400">
            <font-awesome-icon icon="fa-solid fa-spinner" class="animate-spin text-xl mr-2" />
            Generating category breakdown...
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Grid (Row 2: Additional Custom Analysis - Payment Methods & Status Distribution) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Chart 3: Payment Methods Breakdown -->
      <div class="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
        <div class="mb-4">
          <h2 class="text-base font-bold text-neutral-900">Payment Methods Breakdown</h2>
          <p class="text-xs text-neutral-500">Volume distribution across cash, UPI, cards, and bank transfers</p>
        </div>
        <div class="h-64 relative flex items-center justify-center my-2">
          <Doughnut v-if="!loading && chartDataMethods.labels.length" :data="chartDataMethods"
            :options="doughnutOptions" />
          <div v-else class="h-full flex items-center justify-center text-xs text-neutral-400">
            <font-awesome-icon icon="fa-solid fa-spinner" class="animate-spin text-xl mr-2" />
            Loading payment methods...
          </div>
        </div>
      </div>

      <!-- Chart 4: Invoice Status Breakdown -->
      <div class="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col justify-between">
        <div class="mb-6">
          <h2 class="text-base font-bold text-neutral-900">Invoice Status Overview</h2>
          <p class="text-xs text-neutral-500">Distribution of active, returned, and cancelled inventory entries</p>
        </div>
        <div class="h-64 relative">
          <Bar v-if="!loading && chartDataStatus.labels.length" :data="chartDataStatus"
            :options="horizontalBarOptions" />
          <div v-else class="h-full flex items-center justify-center text-xs text-neutral-400">
            <font-awesome-icon icon="fa-solid fa-spinner" class="animate-spin text-xl mr-2" />
            Loading status metrics...
          </div>
        </div>
      </div>
    </div>

    <!-- Automated Financial Insights -->
    <div class="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-xs space-y-4">
      <h2 class="text-xs font-bold text-neutral-400 uppercase tracking-wider">Automated Business Insights</h2>
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
              Your average order value per item sold is <strong>₹{{ averageOrderValue.toLocaleString('en-IN')
                }}</strong>.
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
const loadingReport = ref(false)

// Month & Year state for report generation default to current month/year
const currentDate = new Date()
const selectedMonth = ref(currentDate.getMonth() + 1)
const selectedYear = ref(currentDate.getFullYear())
const availableYears = [2024, 2025, 2026, 2027]

const grandTotalRevenue = ref(0)
const grandTotalCollected = ref(0)
const totalItemsSold = ref(0)
const topCategory = reactive({ name: 'N/A', amount: 0 })

const chartDataTrend = reactive({ labels: [], datasets: [] })
const chartDataCategory = reactive({ labels: [], datasets: [] })
const chartDataMethods = reactive({ labels: [], datasets: [] })
const chartDataStatus = reactive({ labels: [], datasets: [] })

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
    legend: {
      position: 'top',
      labels: { font: { family: 'inherit', size: 12 }, usePointStyle: true, pointStyle: 'circle' }
    }
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { family: 'inherit', size: 11 } } },
    y: { grid: { color: '#f3f4f6' }, beginAtZero: true, ticks: { font: { family: 'inherit', size: 11 } } }
  }
}

const horizontalBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: { display: false }
  },
  scales: {
    x: { grid: { color: '#f3f4f6' }, beginAtZero: true, ticks: { font: { family: 'inherit', size: 11 } } },
    y: { grid: { display: false }, ticks: { font: { family: 'inherit', size: 11 } } }
  }
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { font: { family: 'inherit', size: 12 }, usePointStyle: true, pointStyle: 'circle', boxWidth: 8 }
    }
  }
}

async function triggerMonthlyReport() {
  try {
    loadingReport.value = true

    // Get the current session token to authenticate the request
    const { data: sessionData } = await supabase.auth.getSession()
    const accessToken = sessionData?.session?.access_token

    if (!accessToken) {
      throw new Error('User not authenticated. Please log in again.')
    }

    // Call the Edge Function endpoint directly using fetch
    const functionUrl = 'https://cflbyxvrqvlmsmjlcxqv.supabase.co/functions/v1/send-monthly-report'
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'apikey': 'YOUR_SUPABASE_ANON_KEY' // Or import from your supabase client config if needed
      },
      body: JSON.stringify({ 
        month: selectedMonth.value, 
        year: selectedYear.value 
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Edge Function error (${response.status}): ${errorText}`)
    }

    // Receive raw PDF blob directly
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Shagun_Report_${selectedMonth.value}_${selectedYear.value}.pdf`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

  } catch (err) {
    console.error('Report Generation Error:', err)
    alert('Failed to download report: ' + (err.message || err))
  } finally {
    loadingReport.value = false
  }
}

async function fetchAnalyticsData() {
  loading.value = true
  try {
    const { data: sales } = await supabase
      .from('sales')
      .select('price, paid_amount, item_category, sale_date, status')

    const { data: payments } = await supabase
      .from('payments')
      .select('amount_paid, payment_method, created_at')

    if (sales) {
      const activeSales = sales.filter(s => s.status === 'active')
      totalItemsSold.value = activeSales.length

      let revSum = 0
      let paidSum = 0
      const catMap = {}
      const monthlyTrend = {}
      const statusMap = { active: 0, returned: 0, cancelled: 0 }

      sales.forEach(sale => {
        const price = Number(sale.price || 0)
        const paid = Number(sale.paid_amount || 0)

        statusMap[sale.status] = (statusMap[sale.status] || 0) + 1

        if (sale.status === 'active') {
          revSum += price
          paidSum += paid

          const cat = sale.item_category || 'other'
          catMap[cat] = (catMap[cat] || 0) + price

          const monthKey = new Date(sale.sale_date).toLocaleString('en-IN', { month: 'short', year: '2-digit' })
          if (!monthlyTrend[monthKey]) {
            monthlyTrend[monthKey] = { sales: 0, payments: 0 }
          }
          monthlyTrend[monthKey].sales += price
        }
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
          borderRadius: 6,
          data: months.map(m => monthlyTrend[m].sales)
        },
        {
          label: 'Realized Payments (₹)',
          backgroundColor: '#10b981',
          borderRadius: 6,
          data: months.map(m => monthlyTrend[m].payments)
        }
      ]

      const categories = Object.keys(catMap)
      chartDataCategory.labels = categories.map(c => c.toUpperCase())
      chartDataCategory.datasets = [
        {
          backgroundColor: ['#171717', '#3b82f6', '#f59e0b', '#6b7280', '#10b981'],
          borderWidth: 2,
          borderColor: '#ffffff',
          data: categories.map(c => catMap[c])
        }
      ]

      const methodMap = { cash: 0, upi: 0, card: 0, bank_transfer: 0 }
      if (payments) {
        payments.forEach(p => {
          const m = p.payment_method || 'cash'
          methodMap[m] = (methodMap[m] || 0) + Number(p.amount_paid || 0)
        })
      }
      chartDataMethods.labels = ['Cash', 'UPI', 'Card', 'Bank Transfer']
      chartDataMethods.datasets = [
        {
          backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
          borderWidth: 2,
          borderColor: '#ffffff',
          data: [methodMap.cash, methodMap.upi, methodMap.card, methodMap.bank_transfer]
        }
      ]

      chartDataStatus.labels = ['Active', 'Returned', 'Cancelled']
      chartDataStatus.datasets = [
        {
          backgroundColor: ['#171717', '#f59e0b', '#ef4444'],
          borderRadius: 6,
          data: [statusMap.active, statusMap.returned, statusMap.cancelled]
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