<template>
  <!-- Main container: Removed outer padding on small screens and clamped overflow strictly -->
  <div class="min-h-screen bg-neutral-50/50 py-3 px-2 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden box-border">

    <!-- TOP HEADER & STATS BAR -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white p-3.5 sm:p-5 rounded-2xl border border-neutral-200 shadow-xs box-border w-full">
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-neutral-900/10 text-neutral-900 flex items-center justify-center text-lg sm:text-xl shrink-0">
          <font-awesome-icon icon="fa-solid fa-users" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="text-base sm:text-2xl font-black text-neutral-900 tracking-tight truncate">Customer Directory</h1>
          <p class="text-[11px] sm:text-xs text-neutral-500 mt-0.5 truncate">Manage customer accounts, sales history, and active dues</p>
        </div>
      </div>

      <!-- Mode Switcher Tabs -->
      <div class="flex items-center bg-neutral-100 p-1 rounded-xl shrink-0 self-stretch sm:self-auto border border-neutral-200/60">
        <button
          @click="activeMode = 'all'"
          :class="[
            'flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap text-center',
            activeMode === 'all' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
          ]"
        >
          All Customers
        </button>
        <button
          @click="activeMode = 'date'"
          :class="[
            'flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap text-center',
            activeMode === 'date' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
          ]"
        >
          By Date
        </button>
      </div>
    </div>

    <!-- CONTROLS: SEARCH & DATE TOOLBAR -->
    <div class="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 w-full box-border">
      <!-- Search Input -->
      <div class="relative w-full sm:flex-1 min-w-0">
        <font-awesome-icon icon="fa-solid fa-magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-sm shrink-0 pointer-events-none" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by customer name or phone..."
          class="w-full pl-10 pr-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 shadow-xs box-border"
        />
      </div>

      <!-- Date Filter Controls (Visible when activeMode === 'date') -->
      <div v-if="activeMode === 'date'" class="w-full sm:w-auto flex items-center justify-between gap-2 bg-white p-1.5 border border-neutral-200 rounded-xl shadow-xs shrink-0 box-border">
        <div class="relative flex-1 sm:flex-initial min-w-0">
          <button type="button" class="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1.5 text-xs font-semibold text-neutral-900 shadow-2xs">
            <font-awesome-icon icon="fa-solid fa-calendar-days" class="w-3.5 h-3.5 text-neutral-500 shrink-0" />
            <span class="truncate">{{ formattedSelectedDate }}</span>
          </button>
          <input v-model="selectedDate" type="date" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        </div>

        <div class="flex items-center gap-1 shrink-0">
          <button @click="shiftDate(-1)" class="p-1.5 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors">
            <font-awesome-icon icon="fa-solid fa-chevron-left" class="w-3 h-3" />
          </button>
          <button @click="shiftDate(1)" class="p-1.5 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors">
            <font-awesome-icon icon="fa-solid fa-chevron-right" class="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>

    <!-- LOADING STATE -->
    <div v-if="loading" class="py-16 text-center space-y-3">
      <font-awesome-icon icon="fa-solid fa-spinner" class="animate-spin text-3xl text-neutral-400" />
      <p class="text-xs text-neutral-500 font-medium">Fetching customer directory...</p>
    </div>

    <!-- EMPTY STATE -->
    <div v-else-if="filteredCustomers.length === 0" class="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-12 text-center space-y-3 shadow-xs box-border w-full">
      <div class="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto text-xl">
        <font-awesome-icon icon="fa-solid fa-user-slash" />
      </div>
      <h3 class="text-sm sm:text-base font-bold text-neutral-800">No Customers Found</h3>
      <p class="text-xs text-neutral-500 max-w-sm mx-auto">
        {{ searchQuery ? 'No records match your search criteria.' : 'No customer records available for the selected view.' }}
      </p>
    </div>

    <!-- CUSTOMER LIST DATA -->
    <template v-else>

      <!-- DESKTOP / LAPTOP TABLE VIEW -->
      <div class="hidden md:block w-full max-w-full rounded-2xl border border-neutral-200 bg-white shadow-xs overflow-hidden box-border">
        <div class="w-full max-w-full overflow-x-auto">
          <table class="w-full min-w-[680px] text-left text-sm border-collapse">
            <thead class="bg-neutral-50 border-b border-neutral-200 text-xs font-bold uppercase text-neutral-500">
              <tr>
                <th scope="col" class="py-3.5 px-4">Customer</th>
                <th scope="col" class="py-3.5 px-4">Phone</th>
                <th scope="col" class="py-3.5 px-4 text-right">Total Billed</th>
                <th scope="col" class="py-3.5 px-4 text-right">Remaining Due</th>
                <th scope="col" class="py-3.5 px-4 text-center">Quick Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100">
              <tr v-for="customer in filteredCustomers" :key="customer.id" class="hover:bg-neutral-50/80 transition-colors">
                <!-- Customer -->
                <td class="py-3.5 px-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div
                      v-html="getAvatarSvg(customer.phone_number || customer.name)"
                      class="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 [&>svg]:h-full [&>svg]:w-full shadow-2xs"
                    ></div>
                    <div class="min-w-[120px] max-w-[200px]">
                      <p class="font-bold text-neutral-900 truncate">{{ customer.name }}</p>
                      <p class="text-xs text-neutral-500 truncate">{{ customer.address || 'No address saved' }}</p>
                    </div>
                  </div>
                </td>

                <!-- Phone Number -->
                <td class="py-3.5 px-4 whitespace-nowrap font-mono text-xs text-neutral-600">
                  {{ customer.phone_number }}
                </td>

                <!-- Total Billed -->
                <td class="py-3.5 px-4 text-right font-semibold text-neutral-800 whitespace-nowrap">
                  ₹{{ customer.totalBilled.toLocaleString('en-IN') }}
                </td>

                <!-- Due -->
                <td class="py-3.5 px-4 text-right font-bold whitespace-nowrap">
                  <span :class="customer.totalDue > 0 ? 'text-amber-600' : 'text-emerald-600 font-semibold'">
                    ₹{{ customer.totalDue.toLocaleString('en-IN') }}
                  </span>
                </td>

                <!-- Actions -->
                <td class="py-3.5 px-4 whitespace-nowrap">
                  <div class="flex items-center justify-center gap-1.5">
                    <router-link
                      :to="`/customers/${customer.id}`"
                      class="p-2 bg-neutral-100 text-neutral-800 hover:bg-neutral-200 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                    >
                      <span>View Profile</span>
                      <font-awesome-icon icon="fa-solid fa-arrow-right" class="text-neutral-400" />
                    </router-link>

                    <button
                      @click="deleteCustomerData(customer)"
                      :disabled="deletingId === customer.id"
                      class="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-xs font-semibold disabled:opacity-50 cursor-pointer"
                      title="Delete Customer"
                    >
                      <font-awesome-icon v-if="deletingId === customer.id" icon="fa-solid fa-spinner" class="animate-spin" />
                      <font-awesome-icon v-else icon="fa-solid fa-trash-can" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- MOBILE CARD VIEW -->
      <div class="block md:hidden space-y-2.5 w-full box-border">
        <div
          v-for="customer in filteredCustomers"
          :key="customer.id"
          class="bg-white rounded-xl border border-neutral-200 p-3 shadow-xs space-y-2.5 box-border w-full max-w-full overflow-hidden"
        >
          <!-- Header: Avatar + Customer Info -->
          <div class="flex items-center justify-between border-b border-neutral-100 pb-2.5 gap-2">
            <div class="flex items-center gap-2 min-w-0 flex-1">
              <div
                v-html="getAvatarSvg(customer.phone_number || customer.name)"
                class="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-neutral-200 bg-neutral-100 [&>svg]:h-full [&>svg]:w-full shadow-2xs"
              ></div>
              <div class="min-w-0 flex-1">
                <p class="font-bold text-neutral-900 text-xs sm:text-sm truncate leading-tight">{{ customer.name }}</p>
                <p class="text-[11px] text-neutral-500 font-mono truncate mt-0.5">{{ customer.phone_number }}</p>
              </div>
            </div>
            <span
              :class="[
                'text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0',
                customer.totalDue > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              ]"
            >
              {{ customer.totalDue > 0 ? 'Due Active' : 'Clear' }}
            </span>
          </div>

          <!-- Address / Details -->
          <div class="text-[11px] flex justify-between items-center gap-2">
            <span class="text-neutral-500 shrink-0">Address:</span>
            <span class="font-medium text-neutral-800 truncate text-right flex-1 min-w-0">{{ customer.address || 'No address saved' }}</span>
          </div>

          <!-- Financial Breakdown Card -->
          <div class="bg-neutral-50 p-2 rounded-lg text-xs space-y-1 border border-neutral-100">
            <div class="flex justify-between text-neutral-600 text-[11px]">
              <span>Total Billed:</span>
              <span class="font-semibold">₹{{ customer.totalBilled.toLocaleString('en-IN') }}</span>
            </div>
            <div class="flex justify-between border-t border-neutral-200/80 pt-1 text-xs font-bold">
              <span class="text-neutral-700">Total Pending Due:</span>
              <span :class="customer.totalDue > 0 ? 'text-amber-600' : 'text-emerald-600'">
                ₹{{ customer.totalDue.toLocaleString('en-IN') }}
              </span>
            </div>
          </div>

          <!-- Actions Bar -->
          <div class="grid grid-cols-2 gap-2 pt-0.5 w-full box-border">
            <router-link
              :to="`/customers/${customer.id}`"
              class="w-full py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 transition-colors"
            >
              <span>View Profile</span>
              <font-awesome-icon icon="fa-solid fa-arrow-right" class="text-neutral-400 text-[10px]" />
            </router-link>

            <button
              @click="deleteCustomerData(customer)"
              :disabled="deletingId === customer.id"
              class="w-full py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 border border-red-200 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <font-awesome-icon v-if="deletingId === customer.id" icon="fa-solid fa-spinner" class="animate-spin" />
              <font-awesome-icon v-else icon="fa-solid fa-trash-can" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

    </template>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { Style, Avatar } from '@dicebear/core'
import avataaars from '@dicebear/styles/avataaars.json' with { type: 'json' }

const style = new Style(avataaars)
const activeMode = ref('all') // 'all' | 'date'
const selectedDate = ref(getTodayStr())
const searchQuery = ref('')
const customers = ref([])
const loading = ref(true)
const deletingId = ref(null)

function getTodayStr() {
  return new Date().toISOString().split('T')[0]
}

const formattedSelectedDate = computed(() => {
  if (!selectedDate.value) return ''
  const [year, month, day] = selectedDate.value.split('-')
  const dateObj = new Date(year, month - 1, day)
  return dateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
})

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
    `Are you sure you want to delete "${customer.name}" and ALL associated sales and payment data?`
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
  return customers.value.map(customer => {
    const matchingSales = customer.sales.filter(s => {
      if (s.status !== 'active') return false

      if (activeMode.value === 'date') {
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
    if (activeMode.value === 'date' && customer.matchingSalesCount === 0) {
      return false
    }

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
    seed: seed || 'Customer',
    topProbability: 100,
    topVariant: ['shortFlat', 'shortWaved', 'shortRound', 'shavedSides'],
    hairColor: ['2c1b18', '4a312c', '000000'],
    clothesVariant: ['blazerAndShirt', 'shirtCrewNeck', 'collarAndSweater'],
    backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc']
  })
  return avatar.toString()
}
</script>
