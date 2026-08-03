<template>
  <div class="min-h-screen bg-neutral-50/50 pb-12 pt-6">
    <div class="mx-auto max-w-5xl px-6 space-y-6">

      <!-- Page Header & Filter Tabs -->
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-neutral-900">Customers</h1>
          <p class="text-sm text-neutral-500">Manage customer directories, search accounts, and view outstanding dues.</p>
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
            @click="activeTab = 'single'"
            :class="[
              'px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'single' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            ]"
          >
            Choose Date
          </button>
          <button
            @click="activeTab = 'all'"
            :class="[
              'px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap',
              activeTab === 'all' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
            ]"
          >
            All Customers
          </button>
        </div>
      </div>

      <!-- Single Date Picker with Backward / Forward Navigation -->
      <div v-if="activeTab === 'single'" class="flex flex-row items-center gap-2 bg-white p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-neutral-200/80 shadow-xs overflow-x-auto">
        <div class="flex items-center gap-1.5 shrink-0">
          <label class="text-[11px] sm:text-xs font-semibold text-neutral-600">Date:</label>
          <input
            v-model="selectedDate"
            type="date"
            class="rounded-lg sm:rounded-xl border border-neutral-200 bg-neutral-50 px-2 sm:px-3 py-1 text-[11px] sm:text-xs text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        <div class="flex items-center gap-1.5 ml-2 shrink-0">
          <button
            @click="shiftDate(-1)"
            class="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all cursor-pointer shadow-xs"
            title="Previous Day"
          >
            <font-awesome-icon icon="fa-solid fa-chevron-left" class="w-2.5 h-2.5 text-neutral-500" />
            Prev Day
          </button>
          <button
            @click="shiftDate(1)"
            class="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all cursor-pointer shadow-xs"
            title="Next Day"
          >
            Next Day
            <font-awesome-icon icon="fa-solid fa-chevron-right" class="w-2.5 h-2.5 text-neutral-500" />
          </button>
        </div>

        <button
          v-if="selectedDate !== getTodayStr()"
          @click="selectedDate = getTodayStr()"
          class="text-[11px] sm:text-xs font-semibold text-neutral-500 hover:text-neutral-900 underline ml-auto whitespace-nowrap shrink-0 px-1"
        >
          Today
        </button>
      </div>

      <!-- Search Bar -->
      <div class="flex items-center gap-3">
        <div class="relative flex-1">
          <font-awesome-icon
            icon="fa-solid fa-magnifying-glass"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4"
          />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by phone number or name..."
            class="w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-all shadow-xs"
          />
        </div>
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="px-3 py-2.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          Clear
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-12 text-center text-neutral-400">
        <font-awesome-icon icon="fa-solid fa-spinner" class="animate-spin text-2xl text-neutral-600 mb-2" />
        <p class="text-sm font-medium text-neutral-600">Loading customer directory...</p>
      </div>

      <!-- Customer List Table -->
      <div v-else class="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-xs">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="border-b border-neutral-100 bg-neutral-50/50 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <tr>
                <th scope="col" class="px-6 py-3.5">Customer</th>
                <th scope="col" class="px-6 py-3.5">Phone Number</th>
                <th scope="col" class="px-6 py-3.5">Total Billed</th>
                <th scope="col" class="px-6 py-3.5">Outstanding Due</th>
                <th scope="col" class="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100 text-neutral-700">
              <tr
                v-for="customer in filteredCustomers"
                :key="customer.id"
                class="hover:bg-neutral-50/80 transition-colors group"
              >
                <!-- Avatar & Name -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      v-html="getAvatarSvg(customer.phone_number || customer.name)"
                      class="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 [&>svg]:h-full [&>svg]:w-full"
                    ></div>
                    <div>
                      <p class="font-semibold text-neutral-900">{{ customer.name }}</p>
                      <p class="text-xs text-neutral-400">{{ customer.address || 'No address saved' }}</p>
                    </div>
                  </div>
                </td>

                <!-- Phone Number -->
                <td class="px-6 py-4 font-mono text-xs font-medium text-neutral-600">
                  {{ customer.phone_number }}
                </td>

                <!-- Total Billed -->
                <td class="px-6 py-4 font-medium text-neutral-900">
                  ₹{{ customer.totalBilled.toLocaleString('en-IN') }}
                </td>

                <!-- Pending Due -->
                <td class="px-6 py-4 font-medium">
                  <span
                    :class="[
                      customer.totalDue > 0 ? 'text-amber-600 font-semibold' : 'text-emerald-600 font-normal'
                    ]"
                  >
                    ₹{{ customer.totalDue.toLocaleString('en-IN') }}
                  </span>
                </td>

                <!-- Action Buttons -->
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <router-link
                      :to="`/customers/${customer.id}`"
                      class="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-all cursor-pointer shadow-xs"
                    >
                      View Details
                      <font-awesome-icon icon="fa-solid fa-arrow-right" class="w-3 h-3 text-neutral-400" />
                    </router-link>

                    <button
                      @click="deleteCustomerData(customer)"
                      :disabled="deletingId === customer.id"
                      class="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 hover:text-red-700 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                      title="Delete Customer & All Associated Sales/Payments Data"
                    >
                      <font-awesome-icon v-if="deletingId === customer.id" icon="fa-solid fa-spinner" class="animate-spin w-3 h-3" />
                      <font-awesome-icon v-else icon="fa-solid fa-trash-can" class="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="filteredCustomers.length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-neutral-400">
                  <p class="text-base font-medium text-neutral-700">No matching customers found</p>
                  <p class="text-xs text-neutral-400 mt-1">Try switching date filters or typing a search query.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { Style, Avatar } from '@dicebear/core'
import avataaars from '@dicebear/styles/avataaars.json' with { type: 'json' }

const style = new Style(avataaars)
const activeTab = ref('all') // 'today' | 'week' | 'single' | 'all'
const selectedDate = ref(getTodayStr())
const searchQuery = ref('')
const customers = ref([])
const loading = ref(true)
const deletingId = ref(null)

function getTodayStr() {
  return new Date().toISOString().split('T')[0]
}

function shiftDate(days) {
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() + days)
  selectedDate.value = d.toISOString().split('T')[0]
}

async function fetchCustomers() {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('customers')
      .select(`
        id,
        name,
        phone_number,
        whatsapp_number,
        address,
        sales (
          id,
          price,
          remaining_amount,
          status,
          sale_date
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    customers.value = (data || []).map(cust => {
      return {
        ...cust,
        sales: cust.sales || []
      }
    })
  } catch (err) {
    console.error('Error fetching customers:', err.message)
  } finally {
    loading.value = false
  }
}

async function deleteCustomerData(customer) {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${customer.name}" and ALL associated sales, records, and payment data? This action cannot be undone.`
  )
  if (!confirmed) return

  deletingId.value = customer.id
  try {
    const { data: salesData, error: salesFetchError } = await supabase
      .from('sales')
      .select('id')
      .eq('customer_id', customer.id)

    if (salesFetchError) throw salesFetchError

    const saleIds = (salesData || []).map(s => s.id)

    if (saleIds.length > 0) {
      const { error: paymentsDeleteError } = await supabase
        .from('payments')
        .delete()
        .in('sale_id', saleIds)

      if (paymentsDeleteError) throw paymentsDeleteError

      const { error: salesDeleteError } = await supabase
        .from('sales')
        .delete()
        .eq('customer_id', customer.id)

      if (salesDeleteError) throw salesDeleteError
    }

    const { error: customerDeleteError } = await supabase
      .from('customers')
      .delete()
      .eq('id', customer.id)

    if (customerDeleteError) throw customerDeleteError

    customers.value = customers.value.filter(c => c.id !== customer.id)
  } catch (err) {
    alert('Failed to delete customer data: ' + err.message)
  } finally {
    deletingId.value = null
  }
}

onMounted(() => {
  fetchCustomers()
})

const filteredCustomers = computed(() => {
  const todayStr = getTodayStr()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  return customers.value.map(customer => {
    // Filter customer's individual sales based on active tab / date range
    const matchingSales = customer.sales.filter(s => {
      if (s.status !== 'active') return false

      if (activeTab.value === 'today') {
        return s.sale_date === todayStr
      } else if (activeTab.value === 'week') {
        return s.sale_date && new Date(s.sale_date) >= sevenDaysAgo
      } else if (activeTab.value === 'single') {
        return s.sale_date === selectedDate.value
      }
      return true
    })

    const totalBilled = matchingSales.reduce((sum, s) => sum + Number(s.price || 0), 0)
    const totalDue = matchingSales.reduce((sum, s) => sum + Number(s.remaining_amount || 0), 0)

    return {
      ...customer,
      matchingSalesCount: matchingSales.length,
      totalBilled,
      totalDue
    }
  }).filter(customer => {
    // If a date filter (today, week, single) is active, hide customers with zero matching sales in that timeframe
    if (activeTab.value !== 'all' && customer.matchingSalesCount === 0) {
      return false
    }

    // Search query matching
    if (!searchQuery.value.trim()) return true
    const query = searchQuery.value.toLowerCase().trim()
    return (
      (customer.phone_number && customer.phone_number.toLowerCase().includes(query)) ||
      (customer.name && customer.name.toLowerCase().includes(query))
    )
  })
})

function getAvatarSvg(seed) {
  const avatar = new Avatar(style, {
    seed: seed || 'Shagun',
    topProbability: 100,
    topVariant: ['shortFlat', 'shortWaved', 'shortRound', 'shavedSides'],
    hairColor: ['2c1b18', '4a312c', '000000'],
    clothesVariant: ['blazerAndShirt', 'shirtCrewNeck', 'collarAndSweater'],
    backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc']
  })
  return avatar.toString()
}
</script>
