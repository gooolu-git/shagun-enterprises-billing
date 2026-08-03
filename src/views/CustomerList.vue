<template>
  <div class="min-h-screen bg-neutral-50/50 pb-12 pt-6">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 space-y-4 sm:space-y-6">

      <!-- Page Header & Filter Tabs -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900">Sales History</h1>
          <p class="text-xs sm:text-sm text-neutral-500">View transactions, filter by date ranges, or browse the complete ledger.</p>
        </div>

        <!-- Filter Tabs (Horizontal scrollable/compact on mobile) -->
        <div class="flex items-center bg-neutral-200/70 p-1 rounded-xl overflow-x-auto shrink-0 max-w-full">
          <button
            @click="activeTab = 'today'"
            :class="[
              'px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'today' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            ]"
          >
            Today
          </button>
          <button
            @click="activeTab = 'week'"
            :class="[
              'px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'week' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            ]"
          >
            Last 7 Days
          </button>
          <button
            @click="activeTab = 'custom'"
            :class="[
              'px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'custom' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            ]"
          >
            Custom Range
          </button>
          <button
            @click="activeTab = 'all'"
            :class="[
              'px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'all' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            ]"
          >
            All Sales
          </button>
        </div>
      </div>

      <!-- Custom Date Picker Filters (Single line flex container with compact mobile padding) -->
      <div v-if="activeTab === 'custom'" class="flex flex-row items-center gap-2 bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-neutral-200/80 shadow-xs overflow-x-auto">
        <div class="flex items-center gap-1.5 shrink-0">
          <label class="text-[11px] sm:text-xs font-semibold text-neutral-600">From:</label>
          <input
            v-model="startDate"
            type="date"
            class="rounded-lg sm:rounded-xl border border-neutral-200 bg-neutral-50 px-2 sm:px-3 py-1 text-[11px] sm:text-xs text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <label class="text-[11px] sm:text-xs font-semibold text-neutral-600">To:</label>
          <input
            v-model="endDate"
            type="date"
            class="rounded-lg sm:rounded-xl border border-neutral-200 bg-neutral-50 px-2 sm:px-3 py-1 text-[11px] sm:text-xs text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>
        <button
          v-if="startDate || endDate"
          @click="startDate = ''; endDate = ''"
          class="text-[11px] sm:text-xs font-semibold text-neutral-500 hover:text-neutral-900 underline ml-auto whitespace-nowrap shrink-0 px-1"
        >
          Reset
        </button>
      </div>

      <!-- Search Bar -->
      <div class="flex items-center gap-2 sm:gap-3">
        <div class="relative flex-1">
          <font-awesome-icon
            icon="fa-solid fa-magnifying-glass"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-3.5 h-3.5 sm:w-4 sm:h-4"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search customer, phone, or item/IMEI..."
            class="w-full rounded-xl border border-neutral-200 bg-white pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-all shadow-xs"
          />
        </div>
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="px-2.5 py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors shrink-0"
        >
          Clear
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-16 text-center text-neutral-400">
        <font-awesome-icon icon="fa-solid fa-spinner" class="animate-spin text-3xl text-neutral-700 mb-2" />
        <p class="text-sm font-medium text-neutral-600">Loading sales records...</p>
      </div>

      <!-- Sales Table Card -->
      <div v-else class="overflow-hidden rounded-xl sm:rounded-2xl border border-neutral-200/80 bg-white shadow-xs">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs sm:text-sm">
            <thead class="border-b border-neutral-100 bg-neutral-50/50 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <tr>
                <th scope="col" class="px-3 sm:px-6 py-3">Date</th>
                <th scope="col" class="px-3 sm:px-6 py-3">Customer</th>
                <th scope="col" class="px-3 sm:px-6 py-3">Item Description</th>
                <th scope="col" class="px-3 sm:px-6 py-3">Category</th>
                <th scope="col" class="px-3 sm:px-6 py-3">Price (₹)</th>
                <th scope="col" class="px-3 sm:px-6 py-3">Status</th>
                <th scope="col" class="px-3 sm:px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100 text-neutral-700">
              <tr
                v-for="sale in paginatedSales"
                :key="sale.id"
                class="hover:bg-neutral-50/80 transition-colors group"
              >
                <!-- Date -->
                <td class="px-3 sm:px-6 py-3 font-mono text-[11px] sm:text-xs text-neutral-600 whitespace-nowrap">
                  {{ sale.sale_date }}
                </td>

                <!-- Customer Name & Phone -->
                <td class="px-3 sm:px-6 py-3">
                  <p class="font-semibold text-neutral-900 text-xs sm:text-sm">{{ sale.customers?.name || 'Walk-in Customer' }}</p>
                  <p class="text-[11px] sm:text-xs font-mono text-neutral-400">{{ sale.customers?.phone_number || 'N/A' }}</p>
                </td>

                <!-- Item Description & IMEI -->
                <td class="px-3 sm:px-6 py-3">
                  <p class="font-medium text-neutral-900 text-xs sm:text-sm">{{ sale.item_name }}</p>
                  <p class="text-[11px] sm:text-xs font-mono text-neutral-400">IMEI: {{ sale.imei_or_serial_no || 'None' }}</p>
                </td>

                <!-- Category -->
                <td class="px-3 sm:px-6 py-3 capitalize text-[11px] sm:text-xs">
                  <span class="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-neutral-100 font-medium text-neutral-700 whitespace-nowrap">
                    {{ sale.item_category.replace('_', ' ') }}
                  </span>
                </td>

                <!-- Price -->
                <td class="px-3 sm:px-6 py-3 font-semibold text-neutral-900 text-xs sm:text-sm whitespace-nowrap">
                  ₹{{ Number(sale.price).toLocaleString('en-IN') }}
                </td>

                <!-- Status Badge -->
                <td class="px-3 sm:px-6 py-3 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-semibold rounded-full capitalize',
                      sale.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700' :
                      sale.payment_status === 'partial' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                    ]"
                  >
                    {{ sale.payment_status }}
                  </span>
                </td>

                <!-- Action Button -->
                <td class="px-3 sm:px-6 py-3 text-right whitespace-nowrap">
                  <router-link
                    :to="`/sales/${sale.id}`"
                    class="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all cursor-pointer shadow-xs"
                  >
                    View Bill
                    <font-awesome-icon icon="fa-solid fa-arrow-right" class="w-2.5 h-2.5 text-neutral-400" />
                  </router-link>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="filteredSales.length === 0">
                <td colspan="7" class="px-6 py-12 text-center text-neutral-400">
                  <p class="text-sm sm:text-base font-medium text-neutral-700">No sales records found</p>
                  <p class="text-xs text-neutral-400 mt-1">Try switching date filters or searching for another keyword.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Bar -->
        <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between border-t border-neutral-200/80 px-4 sm:px-6 py-3 bg-neutral-50/30 gap-2">
          <p class="text-[11px] sm:text-xs text-neutral-500">
            Showing <span class="font-semibold text-neutral-800">{{ paginationStart + 1 }}</span> to <span class="font-semibold text-neutral-800">{{ paginationEnd }}</span> of <span class="font-semibold text-neutral-800">{{ filteredSales.length }}</span> entries
          </p>

          <div class="flex items-center gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
            >
              Previous
            </button>
            <span class="text-[11px] sm:text-xs font-medium text-neutral-600 px-1">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="currentPage++"
              :disabled="currentPage >= totalPages"
              class="px-2.5 py-1 text-[11px] sm:text-xs font-semibold rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { supabase } from '@/lib/supabase'

const activeTab = ref('today') // 'today' | 'week' | 'custom' | 'all'
const startDate = ref('')
const endDate = ref('')
const searchQuery = ref('')
const sales = ref([])
const loading = ref(true)

const currentPage = ref(1)
const itemsPerPage = 10

async function fetchSales() {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('sales')
      .select(`
        id,
        item_name,
        item_category,
        imei_or_serial_no,
        price,
        paid_amount,
        remaining_amount,
        payment_status,
        sale_date,
        status,
        customers (
          name,
          phone_number
        )
      `)
      .order('sale_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error
    sales.value = data || []
  } catch (err) {
    console.error('Error fetching sales:', err.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSales()
})

// Reset pagination when tabs, dates, or search queries change
watch([activeTab, startDate, endDate, searchQuery], () => {
  currentPage.value = 1
})

const filteredSales = computed(() => {
  let list = sales.value
  const todayStr = new Date().toISOString().split('T')[0]

  // Filter by active tab or custom date range
  if (activeTab.value === 'today') {
    list = list.filter(s => s.sale_date === todayStr)
  } else if (activeTab.value === 'week') {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    list = list.filter(s => new Date(s.sale_date) >= sevenDaysAgo)
  } else if (activeTab.value === 'custom') {
    if (startDate.value) {
      list = list.filter(s => s.sale_date >= startDate.value)
    }
    if (endDate.value) {
      list = list.filter(s => s.sale_date <= endDate.value)
    }
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(s =>
      (s.item_name && s.item_name.toLowerCase().includes(q)) ||
      (s.imei_or_serial_no && s.imei_or_serial_no.toLowerCase().includes(q)) ||
      (s.customers?.name && s.customers.name.toLowerCase().includes(q)) ||
      (s.customers?.phone_number && s.customers.phone_number.toLowerCase().includes(q))
    )
  }

  return list
})

const totalPages = computed(() => Math.ceil(filteredSales.value.length / itemsPerPage) || 1)

const paginationStart = computed(() => (currentPage.value - 1) * itemsPerPage)
const paginationEnd = computed(() => Math.min(paginationStart.value + itemsPerPage, filteredSales.value.length))

const paginatedSales = computed(() => {
  return filteredSales.value.slice(paginationStart.value, paginationEnd.value)
})
</script>
